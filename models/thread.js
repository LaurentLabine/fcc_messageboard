const mongoose = require('mongoose')
const ReplySchema = require('./reply').ReplySchema

var ThreadSchema = new mongoose.Schema({
    thread: String,
    text: String,
    created_on: Date,
    bumped_on: Date,
    reported: Boolean,
    delete_password: String,
    replies: [ReplySchema]
  });
  
  var Thread = mongoose.model('Thread', ThreadSchema);
  
  module.exports = {
    ThreadSchema: ThreadSchema,
    Thread: Thread
  }
