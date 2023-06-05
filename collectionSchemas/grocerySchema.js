const mongoose = require("mongoose")
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const month = months[new Date().getMonth()] + '-' + new Date().getFullYear();
const date = new Date().toLocaleDateString();
const grocerySchema = mongoose.Schema({
    month: {
        type: String,
        default: month
    },
    date: {
        type: String,
        default: date
    },
    total: {
        type: Number,
        default: 0
    },
    list: [
        {
            name: String,
            amount: Number,
            price: Number,
        }
    ]
})


module.exports = grocerySchema