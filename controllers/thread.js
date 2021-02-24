const Thread = require("../models/thread").Thread

class ThreadController{

    createThread(threadReq, cb){

        var newthread = new Thread(threadReq)
        newthread.created_on = new Date().toUTCString()
        newthread.bumped_on = new Date().toUTCString()
        newthread.reported = false
        newthread.replies = []

        newthread.save((err, doc) => {
            if(err) console.error(err)
        })

        cb(newthread)
    }


    //https://stackoverflow.com/questions/23642510/send-mongodb-query-result-as-json-using-express
    getThreads(board, cb){

        var threads = Thread.find({board:board})
        .sort({bumped_on: 'desc'})
        .limit(10)
        .select('-delete_password -reported')
        .lean()
        .exec((err, data) => {
        if(err) console.error(err)
        if(!data) return
        
        data.forEach((thread) =>{
            //Sort by date
            thread.replies.sort((thread1, thread2) => {
                return thread2.created_on - thread1.created_on
            })

            thread.replycount = thread.replies.length

            //Slice replies off
            thread.replies = thread.replies.slice(0, 3)

            thread.replies.forEach((reply) => {
                reply.delete_password = undefined
                reply.reported = undefined
            })
        })
        cb(data)
        }) 
    }

    deleteThread(req, cb){
 
        if(!req)
            return

        var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$")

        if(!checkForHexRegExp.test(req.thread_id))
            return cb("Invalid ID")

        Thread.findById(req.thread_id, ((err, data) => {
            if(err) console.error(err)

            if(data.delete_password == req.delete_password)
                Thread.deleteOne({_id:req._id}, ((err, data) => {
                    if(err) console.error(err)
                    return cb("Success")
                }))
            else
                return cb("Invalid password")
        }))
        return
    }

    reportThread(req, cb){
        
        if(!req)
            return

        var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$")

        if(!checkForHexRegExp.test(req.thread_id))
            return cb("Invalid ID")

        var updatedThread = Thread.findByIdAndUpdate( //Await here causes the entry to be added twice to the DB.  No clue why.
            req.thread_id,
            {reported: true},
            {new: true},
            (err, doc) => {
                if(err) return console.error(err)
            return cb("Reported")
        })
        return
    }
}

module.exports = ThreadController