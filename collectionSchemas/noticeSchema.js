const mongoose = require("mongoose");
const date = new Date().toLocaleDateString();
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const month = months[new Date().getMonth()] + "-" + new Date().getFullYear();
const noticeSchema = mongoose.Schema({
  to: String,
  title: String,
  notice: String,
  index: Number,
  month: {
    type: String,
    default: month,
  },
  date: {
    type: String,
    default: date,
  },
  sender: {
    type: mongoose.Types.ObjectId,
    ref: "Admin",
  },
});

module.exports = noticeSchema;
