const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
const markScheme = new Schema({
  mark: String,
  subject: String,
  hash: String,
  previousHash: String,
  studentId: String,
  nonce: Number,
  timestamp: Number,
});

module.exports = markScheme;
