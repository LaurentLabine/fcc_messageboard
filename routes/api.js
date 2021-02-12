'use strict';
const ThreadController = require('../controllers/thread.js')
const ReplyController = require('../controllers/reply.js')
const Thread = require('../models/thread.js')

module.exports = function (app) {

  const threadController = new ThreadController()
  const replyController = new ReplyController()
  
  app.route('/api/threads/:board')
    .post(function (req, res){//Creating a new thread: POST request to /api/threads/{board}
    console.log(req.body) //format: { board: 'asdf', text: 'sdfdfs', delete_password: 'bob' }
    console.log(req.params)

      if(!req.body.board || req.body.board === '')//If board isn't passed in the arguments, we add it
        req.body.board = req.params.board

      var thread = threadController.createThread(req.body)
      res.redirect('/b/' + thread.board + '/')
    })
    
    .get(function (req, res){//Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}

      if(!req.body.board || req.body.board === '')//If board isn't passed in the arguments, we add it
        req.body.board = req.params.board

      threadController.getThreads(req.body.board, (threads) => {
        res.json(threads)
      })
    })
    
    .delete(function (req, res){//Deleting a thread
      //if password is incorrect: return "incorrect password".  Otherwise return "Success".
      threadController.deleteThread(req.body, (response) => {
        res.send(response)
      })
    })

    .put(function (req, res){//Reporting a thread 
      threadController.reportThread(req.body, (response) => {
        res.send(response)
      })
    })

  app.route('/api/replies/:board')
    .post(function (req, res){//Creating a new reply
    
      if(!req.body.board || req.body.board === '')//If board isn't passed in the arguments, we add it
        req.body.board = req.params.board
    
      replyController.createReply(req.body)
      res.redirect('/b/' + req.body.board + '/' + req.body.thread_id) // + '?new_reply_id=' + newThread.replies[newThread.replies-1]._id)
    })

    .get(function (req, res){ // Viewing a single thread with all replies

      if(!req.body.board || req.body.board === '')//If board isn't passed in the arguments, we add it
      req.body.board = req.params.board

      console.log(req.query.thread_id)

      replyController.viewReplies(req.query, (response) => {
        console.log(response)
        res.json(response)
      })
    })

    .delete(function(req, res){
      // console.log("Body")
      // console.log(req.body)
      // console.log("Params")
      // console.log(req.params)
      // console.log("Query")
      // console.log(req.query)
      replyController.deleteReply(req.body, (data)=> res.json(data))//.then(result => res.json({info:result}))
    })

    .put(function(req, res){
      reply.reportReply().then(result => res.json({info:result}))
    })
};