const mongoose = require("mongoose");
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
const balanceSheetSchema = mongoose.Schema({
  /* payment: {
    type: mongoose.Types.ObjectId,
    ref: "Payment",
  },
  grocery: {
    type: mongoose.Types.ObjectId,
    ref: "Grocery",
  },
  salary: {
    type: mongoose.Types.ObjectId,
    ref: "Salary",
  },
  utility: {
    type: mongoose.Types.ObjectId,
    ref: "Utility",
  }, */
  payment: Number,
  grocery: Number,
  salary: Number,
  utility: [
    {
      type: Number,
    },
  ],
  month: {
    type: String,
    default: month,
  },
});

module.exports = balanceSheetSchema;
