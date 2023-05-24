const mongoose = require("mongoose");
const date = new Date().toLocaleDateString();
const staffSchema = mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  position: String,
  salary: Number,
  joining: {
    type: String,
    default: date
  },
  record: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Salary"
    }
  ]
});

module.exports = staffSchema;
