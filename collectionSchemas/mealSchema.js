const mongoose = require("mongoose");
const date = new Date().toJSON().slice(0,10).split('-').reverse().join('-'); /* new Date().toLocaleDateString(); */
const time = new Date().toLocaleTimeString();
const mealSchema = mongoose.Schema({
    meal: {
        type: String,
        enum: ["Breakfast", "Lunch", "Dinner"]
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    date: {
        type: String,
        default: date
    },
    time: {
        type: String,
        default: time
    },
})


module.exports = mealSchema;