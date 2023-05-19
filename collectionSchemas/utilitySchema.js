const mongoose = require("mongoose");
const m = new Date().getMonth();
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const utilitySchema = mongoose.Schema({
    name: {
        type: String,
        enum: ["electricity", "groceries", "gas", "water", "wifi"]
    },
    month: {
        type: String,
        default: month[m]
    },
    status: {
        type: Number,
        enum: [0,1],
        default: 1
    },
    bill: {
        type: Number,
        default: 0
    },
    Due: {
        type: Number,
        default: 0
    },
    Date: {
        type: String,
        default: "---"
    }
})


module.exports = utilitySchema;