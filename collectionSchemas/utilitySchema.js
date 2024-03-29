const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const month = months[new Date().getMonth()] + '-' + new Date().getFullYear();
const utilitySchema = mongoose.Schema({
    name: {
        type: String,
        enum: ["electricity", "gas", "water", "wifi"]
    },
    month: {
        type: String,
        default: month
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
    due: {
        bill: {
            type: Number,
            default: 0
        },
        id: {
            type: ObjectId
        }
    },
    trxID: String,
    date: {
        type: String,
        default: "---"
    },
    /* DueId : GET Id of the utility to update that month's payment */
})


module.exports = utilitySchema;