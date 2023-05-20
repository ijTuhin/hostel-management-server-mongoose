const mongoose = require("mongoose");
const date = new Date().toLocaleDateString();
const userSchema = mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  district: String,
  thana: String,
  gsuit: String,
  matric: {
    type: String,
    required: true,
  },
  sem: String,
  dept: String,
  current: String,
  last: String,
  room: String,
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
