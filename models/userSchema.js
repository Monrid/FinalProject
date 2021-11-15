const mongoose = require("mongoose");

const Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const myuser = new Schema({
  user_name: {
      firstname: String,
      lastname: String
  },
  user_username: String,
  user_password: String,
  user_email: String,
  user_mobile: String
});

module.exports = mongoose.model("users", myuser);