const mongoose = require("mongoose");
const date = new Date().toLocaleDateString();
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const month = months[new Date().getMonth()] + '-' + new Date().getFullYear();
const packageSchema = mongoose.Schema({
    /* name: {
        type: String,
        enum: ['2days', '1week', '30days']
    }, */
    size: {
        type: Number,
        enum: [2, 7, 30]
    },
    date: {
      type: String,
      default: date,
    },
    month: {
      type: String,
      default: month,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
})

module.exports = packageSchema