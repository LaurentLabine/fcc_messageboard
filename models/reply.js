const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
    text: String,
    created_on : Date,
    reported: Boolean,
    delete_password: String
});

const Reply = mongoose.model('Reply', ReplySchema);

module.exports = {
  ReplySchema: ReplySchema
}