const Board = require("../models/board").Board
const Thread = require("../models/thread").Thread

class BoardController{

    async createBoard(boardReq){
        var newBoard = new Board({
            board: boardReq.board,
            threads: []
        })
        var boardExists = await Board.findOne({board: newBoard.board}, (err, doc) => {
            if(err) console.error(err)
          })
        if(!boardExists)
            newBoard.save((err, doc) => {
            if(err) console.error(err)
        })
    }

    async getBoard(boardId){
        console.log("Get board" + boardId)
        return await Board.findOne({board: boardId}, (err, doc) => {
            if(err) console.error(err)
          })
    }

    // async deleteThread(){
    //     return "Deleting a thread with the incorrect password"
    // }

    // async reportThread(){
    //     return "Reporting a thread"
    // }
}

module.exports = BoardController


//Get Board result:
// {
//     "_id": "601c4a3f49e5dd1fb546c90f",
//     "text": "nah",
//     "created_on": "2021-02-04T19:25:51.532Z",
//     "bumped_on": "2021-02-04T21:07:39.193Z",
//     "reported": true,
//     "delete_password": "ye",
//     "replies": [
//       {
//         "_id": "601c61e449e5dd1fb546c910",
//         "text": "\r\nJjjj\r\n",
//         "created_on": "2021-02-04T21:06:44.141Z",
//         "reported": false,
//         "delete_password": "auth.usenet.nl"
//       },
//       {
//         "_id": "601c61f849e5dd1fb546c911",
//         "text": "(2021-02-04T21:06:44.141Z)",
//         "created_on": "2021-02-04T21:07:04.171Z",
//         "reported": false,
//         "delete_password": "auth.usenet.nl"
//       },
//       {
//         "_id": "601c621849e5dd1fb546c912",
//         "text": "(2021-02-04T21:06:44.141Z)",
//         "created_on": "2021-02-04T21:07:36.826Z",
//         "reported": false,
//         "delete_password": "(2021-02-04T21:06:44.141Z)"
//       },
//       {
//         "_id": "601c621a49e5dd1fb546c913",
//         "text": "(2021-02-04T21:06:44.141Z)",
//         "created_on": "2021-02-04T21:07:38.126Z",
//         "reported": false,
//         "delete_password": "(2021-02-04T21:06:44.141Z)"
//       },
//       {
//         "_id": "601c621b49e5dd1fb546c914",
//         "text": "(2021-02-04T21:06:44.141Z)",
//         "created_on": "2021-02-04T21:07:39.046Z",
//         "reported": false,
//         "delete_password": "(2021-02-04T21:06:44.141Z)"
//       }
//     ]
//   }