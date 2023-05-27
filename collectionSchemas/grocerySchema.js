const mongoose = require("mongoose")
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const month = months[new Date().getMonth()] + '-' + new Date().getFullYear();
const date = new Date().toLocaleDateString();
const grocerySchema = mongoose.Schema({
    month: {
        type: String,
        default: month
    },
    name: String,
    amount: String,
    rate: Number,
    cost: Number,
    date: {
        type: String,
        default: date
    }
})


module.exports = grocerySchema