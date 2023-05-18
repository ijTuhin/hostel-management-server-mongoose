const mongoose = require("mongoose");
const date = /* new Date().toJSON().slice(0,10).split('-').reverse().join('-');  */new Date().toLocaleDateString();
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
})


module.exports = attendanceSchema;