const mongoose = require("mongoose");
const date = new Date().toLocaleDateString();
const time = new Date().toLocaleTimeString();
const attendanceSchema = mongoose.Schema({
    date: {
        type: String,
        default: date
    },
    time: {
        type: String,
        default: time
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
})


module.exports = attendanceSchema;