const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  message: { type: Schema.Types.ObjectId, ref: "Message" },
  country: { type: String, required: true },
  gender: { type: String, required: true },
  acceptTerms: { type: Boolean, default: false, required: true },
  imageURL: { type: String, required: true },
});

module.exports = mongoose.model("User", schema);
