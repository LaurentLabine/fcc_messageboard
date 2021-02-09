var Reply = require("../models/reply").Reply
var Board = require("../models/board").Board

class ReplyController{
    async createReply(board, reply){
        console.log("create Reply")

        // var newReply = new Reply({
        //     text: reply.text,
        //     created_on : new Date(),
        //     reported: false,
        //     delete_password: reply.delete_password
        // })
        // console.log("UpdatingONe")
        // Board.updateOne( //Await here causes the entry to be added twice to the DB.  No clue why.
        //     {board:board.replace('%20',' ')},
        //     {$push:{replies : newReply}},
        //     (err, doc) => {
        //         if(err) console.error(err)
        //     })
    }

    async viewReplies(){
        return "Viewing a single thread with all replies"
    }

    async deleteReply(){
        return "Deleting a reply"
    }

    async reportReply(){
        return "Reporting a reply"
    }
}

module.exports = ReplyController