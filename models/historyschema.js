const mongoose = require("mongoose");

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const history = new Schema({
    userid: String,
    number: String,
    amount: String,
    date: {type:Date,default:Date.now}
});

module.exports = mongoose.model("History", history);