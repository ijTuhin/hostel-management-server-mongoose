const mongoose = require("mongoose");
const date = new Date().toLocaleDateString();
const m = new Date().getMonth();
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const salarySchema = mongoose.Schema({
  amount: Number,
  date: {
    type: String,
    default: date,
  },
  month: {
    type: String,
    default: month[m],
  },
});

module.exports = salarySchema;
