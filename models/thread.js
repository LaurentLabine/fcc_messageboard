const mongoose = require('mongoose')
const ReplySchema = require('./reply').ReplySchema

var ThreadSchema = new mongoose.Schema({
    board: {type: String, required: true},
    text: {type: String, required: true},
    created_on: {type: Date, required: true},
    bumped_on: {type: Date, required: true},
    reported: {type: Boolean, required: true},
    delete_password: {type: String, required: true},
    replies: {type: [ReplySchema], required: true}
  });
  
  var Thread = mongoose.model('Thread', ThreadSchema, "MessageBoard");
  
  module.exports = {
    Thread: Thread
  }
