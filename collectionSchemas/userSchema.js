const mongoose = require("mongoose");
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
    type: Date,
    default: Date.now,
  },
  meal: Boolean,
  rent: Boolean,
  coupon: Number,
});

module.exports = userSchema;
