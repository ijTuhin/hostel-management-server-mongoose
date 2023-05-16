const mongoose = require("mongoose");
const seatSchema = mongoose.Schema({
  member1: String,
  member2: String,
  member3: String,
  member4: String,
  member5: String,
  member6: String,
  room: String,
  vacancy: Boolean
});

module.exports = seatSchema;