const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  username: { type: String, required: true },
  imageURL: { type: String, required: true },
});

module.exports = mongoose.model("Message", schema);
