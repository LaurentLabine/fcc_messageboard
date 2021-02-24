'use strict';
const ThreadController = require('../controllers/thread.js')
const ReplyController = require('../controllers/reply.js')
const Thread = require('../models/thread.js')

module.exports = function (app) {

  const threadController = new ThreadController()
  const replyController = new ReplyController()
  
  app.route('/api/threads/:board')
    .post(function (req, res){//Creating a new thread: POST request to /api/threads/{board}

      if(!req.body.board || req.body.board === '')//If board isn't passed in the arguments, we add it
        req.body.board = req.params.board

      threadController.createThread(req.body, (response) =>{
        console.log('/b/' + response.board + '/'+ response._id)
        return res.redirect('/b/' + response.board + '/'+ response._id)
      })
      
      
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
        res.json(response)
      })
    })

    .put(function (req, res){//Reporting a thread 
      threadController.reportThread(req.body, (response) => {
        res.json(response)
      })
    })

  app.route('/api/replies/:board')
    .post(function (req, res){//Creating a new reply
    
      if(!req.body.board || req.body.board === '')//If board isn't passed in the arguments, we add it
        req.body.board = req.params.board
    
      replyController.createReply(req.body)
      return res.redirect('/b/' + req.body.board + '/' + req.body.thread_id) // + '?new_reply_id=' + newThread.replies[newThread.replies-1]._id)
    })

    .get(function (req, res){ // Viewing a single thread with all replies

      if(!req.body.board || req.body.board === '')//If board isn't passed in the arguments, we add it
      req.body.board = req.params.board

      replyController.viewReplies(req.query, (response) => {
        res.json(response)
      })
    })

    .delete(function(req, res){

      if(!req.body.board || req.body.board === '')//If board isn't passed in the arguments, we add it
      req.body.board = req.params.board

      replyController.deleteReply(req.body, (data)=> res.json(data))//.then(result => res.json({info:result}))
    })

    .put(function(req, res){
      replyController.reportReply(req.body,(response) => {
        res.json(response)
      })    
    })
};