const mongoose = require("mongoose");

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const lotto = new Schema({
    number: String,
    amount: String,
    price: String
});

module.exports = mongoose.model("Lotto", lotto);