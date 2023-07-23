const mongoose = require("mongoose");
const date = new Date().toLocaleDateString();
const userSchema = mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  district: String,
  thana: String,
  matric: String,
  email: String,
  password: String,
  sem: String,
  dept: String,
  program: String,
  role: {
    type: Boolean,
    default: false,
  },
  account: {
    type: Boolean,
    default: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seat",
  },
  enroll: {
    type: String,
    default: date,
  },
  meal: {
    type: Boolean,
    default: false,
  },
  rent: {
    type: Boolean,
    default: false,
  },
  coupon: {
    type: Number,
    default: 0,
  },
  payments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Payment",
    },
  ],
  orders: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Meal",
    },
  ],
  attendance: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Attendance",
    },
  ],
  notice: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Notice",
    },
  ],
  message: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
  ],
});

module.exports = userSchema;
