const mongoose = require("mongoose");
const time = new Date().toLocaleTimeString();
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
const mealSchema = mongoose.Schema({
  meal: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner"],
  },
  status: {
    type: Boolean,
    enum: [0, 1],
    default: 0,
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
    ref: "User",
  },
});

module.exports = mealSchema;
