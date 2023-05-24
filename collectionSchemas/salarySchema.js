const mongoose = require("mongoose");
const date = new Date().toLocaleDateString();
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const month = months[new Date().getMonth()] + '-' + new Date().getFullYear();
const salarySchema = mongoose.Schema({
  month: {
    type: String,
    default: month,
  },
  salary: Number,
  date: {
      type: String,
      default: date,
  },
  staff: {
      type: mongoose.Types.ObjectId,
      ref: "Staff",
  }
});

module.exports = salarySchema;
