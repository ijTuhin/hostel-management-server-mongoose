const mongoose = require("mongoose");
const date = new Date().toLocaleDateString();
const m = new Date().getMonth();
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const paymentSchema = mongoose.Schema({
  item: {
    type: String,
    enum: ["meal", "rent"],
  },
  date: {
    type: String,
    default: date,
  },
  month: {
    type: String,
    default: month[m],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  }
});

module.exports = paymentSchema;
