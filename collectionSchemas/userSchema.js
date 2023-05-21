const mongoose = require("mongoose");
const date = new Date().toLocaleDateString();
const userSchema = mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  district: String,
  thana: String,
  email: String,
  matric: {
    type: String,
    required: true,
  },
  password: String,
  sem: String,
  dept: String,
  program: String,
  current: String,
  last: String,
  room: {
    type: String,
    default: "0",
  },
  enroll: {
    type: String,
    default: date,
  },
  meal: {
    type:Boolean,
    default: false
  },
  rent: {
    type:Boolean,
    default: false
  },
  coupon: {
    type: Number,
    default: 0
  },
});

module.exports = userSchema;
