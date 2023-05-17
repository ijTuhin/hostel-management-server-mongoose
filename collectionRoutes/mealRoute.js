const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const mealSchema = require("../collectionSchemas/mealSchema")
const Meal = new mongoose.model("Meal", mealSchema)


module.exports = router;