const mongoose = require('mongoose')
const ThreadSchema = require('./thread').ThreadSchema

var BoardSchema = new mongoose.Schema({
    board: String,
    threads: [ThreadSchema]
  });
  
  var Board = mongoose.model('Board', BoardSchema,"MessageBoard");
  
  module.exports = {
    Board: Board
  }

