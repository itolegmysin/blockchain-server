const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
const studentScheme = new Schema({
  name: String,
  course: Number,
  speciality: String,
});

module.exports = studentScheme;
