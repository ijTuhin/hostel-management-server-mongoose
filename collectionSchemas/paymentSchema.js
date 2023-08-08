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
  trxID: String,
  phone: String,
  package: {
    type: Number,
    enum: [2, 7, 30]
  },
  date: {
    type: String,
    default: new Date().getDate(),
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
