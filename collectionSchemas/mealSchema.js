const mongoose = require("mongoose");
const date = new Date().toLocaleDateString();
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
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
})


module.exports = mealSchema;