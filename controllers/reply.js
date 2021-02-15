var Reply = require("../models/reply").Reply
var Thread = require("../models/thread").Thread
var ObjectId = require('mongodb').ObjectID;

class ReplyController{
    createReply(replyReq){
        console.log("create Reply")

        var newReply = new Reply(replyReq)

        newReply.created_on = new Date().toUTCString()
        newReply.reported = false

        // console.log(replyReq.thread_id)
         var updatedThread = Thread.findByIdAndUpdate( //Await here causes the entry to be added twice to the DB.  No clue why.
            replyReq.thread_id,
            {$push: {replies: newReply}, bumped_on:new Date().toUTCString()},
            {new: true},
            (err, doc) => {
                if(err) return console.error(err)
            })
        return
    }

    viewReplies(req, cb){

        // console.log("here")
        // console.log(req.thread_id)

        Thread.findById((req.thread_id),(err, doc) => {
            if(err) console.error(err)

            if(!doc)
                return

            if(!doc.replies)
                return cb(doc)
            
            doc.replies.forEach(reply =>{
                reply.delete_password = undefined
                reply.reported = undefined
            })

            return cb(doc)
        })
        return
    }

    async deleteReply(req, cb){
        
        if(!req)
            return

        var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$")

        if(!checkForHexRegExp.test(req.thread_id))
            return cb("Invalid ID")

        Thread.findOne(({"replies._id": req.reply_id}), (err, updThread) =>{
            if(err) console.error(err)

            console.log(updThread)
            console.log(updThread.replies)
            
            for(var i = 0; i< updThread.replies.length; i++){
                if(updThread.replies[i]._id == req.reply_id){
                    if(updThread.replies[i].delete_password === req.delete_password)
                    updThread.replies[i].text="[deleted]"
                    break
                }
                else
                    return "Incorrect ID"
            }

            updThread.save((err, doc) => {
                if(err) return console.error(err)
                return cb("Success")
            })
            return
        })
    }

    reportReply(req, cb){
        
        if(!req)
        return

    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$")

    if(!checkForHexRegExp.test(req.thread_id))
        return cb("Invalid ID")

    Thread.findOne(({"replies._id": req.reply_id}), (err, repThread) =>{
        if(err) console.error(err)
        
        for(var i = 0; i< repThread.replies.length; i++){
            if(repThread.replies[i]._id == req.reply_id){
                repThread.replies[i].reported=true
                break
            }
        }

        repThread.save((err, doc) => {
            if(err) return console.error(err)
            return cb("Reported")
        })
        return
    })
    }
}

module.exports = ReplyController