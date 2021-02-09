'use strict';
const BoardController = require('../controllers/board.js')
const ReplyController = require('../controllers/reply.js')

module.exports = function (app) {

  const board = new BoardController()  
  const reply = new ReplyController()
  
  app.route('/api/threads/:board')
    .post(function (req, res){//Creating a new thread: POST request to /api/threads/{board}
    console.log(req.body) //format: { board: 'asdf', text: 'sdfdfs', delete_password: 'bob' }
    console.log(req.params)
    //Create Board and re-route to : /b/TestingBoardCreation/.  Also creates a thread

    console.log("Board : " + req.params.board)
    if(req.body.board){
      console.log("Call 1")
      // board.createBoard(req.body).then(board.getBoard(req.body.board).then(res.redirect(302, '/b/' + req.body.board + '/')))
      board.createBoard(req.body).then(res.redirect(302, '/b/' + req.body.board + '/'))
      
    }
    else{
      console.log("Call 2")
      reply.createReply(req.params.board,req.body).then(res.redirect(304, '/b/' + req.params.board + '/'))

    }
    })
    
    .get(function (req, res){//Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}
    //get request to https://anonymous-message-board.freecodecamp.rocks/api/threads/sdfgsdfgsdfg returns :
//     returns : [
//     {
//       "_id": "6022d6675d9f5005e2c1ac0c",
//       "text": "asdf",
//       "created_on": "2021-02-09T18:37:26.991Z",
//       "bumped_on": "2021-02-09T18:37:26.991Z",
//       "reported": false,
//       "delete_password": "asdf",
//       "replies": [],
//       "replycount": 0
//   }

// ]
console.log(req.params)
      board.getBoard(req.params.board).then(result => res.json({info:result}))
    })
    
    .delete(function (req, res){//Deleting a thread
      board.deleteThread().then(result => res.json({info:result}))
    })

    .put(function (req, res){//Deleting a thread 
      board.reportThread().then(result => res.json({info:result}))
    })

  app.route('/api/replies/:board')
    .post(function (req, res){//Creating a new reply
      reply.createReply().then(result => res.json({info:result}))
    })

    .get(function (req, res){ // Viewing a single thread with all replies
      reply.viewReplies().then(result => res.json({info:result}))
    })

    .delete(function(req, res){
      reply.deleteReply().then(result => res.json({info:result}))
    })

    .put(function(req, res){
      reply.reportReply().then(result => res.json({info:result}))
    })
};