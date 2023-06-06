const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkLogin = require("../Authentications/checkLogin.js");
const mealSchema = require("../collectionSchemas/mealSchema");
const Meal = new mongoose.model("Meal", mealSchema);
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);

// POST meal order with time condition
router.post("/order", checkLogin, async (req, res) => {
  /* ================================================
                Set Time Condition
  ================================================ */
  const date = new Date();
  const time = date.toTimeString().split(":")[0];
  const today = date.toLocaleDateString();
  date.setDate(date.getDate() + 1);
  const tomorrow = date.toLocaleDateString();
  console.log(today, time, tomorrow);
  let meal;
  let day = today;
  if (time > 4 && time < 10) {
    meal = "Lunch";
  } else if (time > 13 && time < 18) {
    meal = "Dinner";
  } else if (time > 19 || time < 2) {
    meal = "Breakfast";
    day = tomorrow;
  }
  /* ============================================= */
  const user = await User.findOne({ _id: req.userId });
  const newMeal = await new Meal({
    ...req.body,
    meal: meal,
    date: day,
    user: req.userId,
  }).save();
  await User.updateOne(
    { _id: req.userId },
    {
      $push: { orders: newMeal._id },
      $set: {
        coupon: user.coupon - 1,
      },
    }
  )
    .then(() => res.json(`${newMeal.meal} order for ${newMeal.date}`))
    .catch(() => res.json("Oops! Something went wrong!"));
});

module.exports = router;