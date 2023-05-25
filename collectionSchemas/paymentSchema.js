const mongoose = require("mongoose");
const date = new Date().toLocaleDateString();
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const month = months[new Date().getMonth()] + '-' + new Date().getFullYear();
const paymentSchema = mongoose.Schema({
  item: {
    type: String,
    enum: ["meal", "rent"],
  },
  bill: Number,
  date: {
    type: String,
    default: date,
  },
  month: {
    type: String,
    default: month,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

module.exports = paymentSchema;
