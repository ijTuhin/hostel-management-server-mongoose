const mongoose = require("mongoose");
const paymentSchema = mongoose.Schema({
  item: {
    type: String,
    enum: ["meal", "rent"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  /* userId :{} To set Relation with User Collection */
});

module.exports = paymentSchema;
