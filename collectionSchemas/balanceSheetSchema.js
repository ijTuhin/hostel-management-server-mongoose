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
  mealBill: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Payment",
    },
  ],
  seatRent: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Payment",
    },
  ],
  grocery: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Grocery",
    },
  ],
  salary: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Salary",
    },
  ],
  utility: [
    {
      /* name: String,
      bill: Number */
      type: mongoose.Types.ObjectId,
      ref: "Utility",
    },
  ],
  status: {
    type: Boolean,
    default: 1,
  },
  credit: {
    type: Number,
    default: 0,
  },
  debit: {
    type: Number,
    default: 0,
  },
  month: {
    type: String,
    default: month,
  },
});

module.exports = balanceSheetSchema;
