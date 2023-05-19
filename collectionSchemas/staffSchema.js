const mongoose = require("mongoose");
const staffSchema = mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  position: String,
  salary: Number,
  joining: String
});

module.exports = staffSchema;
