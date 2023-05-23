const mongoose = require("mongoose")
const date = new Date().toLocaleDateString();
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const month = months[new Date().getMonth()] + '-' + new Date().getFullYear()
const grocerySchema = mongoose.Schema({
    month: {
        type: String,
        default: month
    },
    list: [
        {
            name: String,
            amount: Number,
            price: Number,
            date: {
                type: String,
                default: date
            }
        }
    ]
})


module.exports = grocerySchema