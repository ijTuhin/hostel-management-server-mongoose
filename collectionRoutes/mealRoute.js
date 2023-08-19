const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkLogin = require("../Authentications/checkLogin.js");
const checkAdminLogin = require("../Authentications/checkAdminLogin.js");
const mealSchema = require("../collectionSchemas/mealSchema");
const Meal = new mongoose.model("Meal", mealSchema);
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);
const adminSchema = require("../collectionSchemas/adminSchema.js");
const Admin = new mongoose.model("Admin", adminSchema);
/* ===============================================
                Set Day & Time 
================================================ */
const date = new Date();
let time = date.toTimeString().split(":")[0];
time = parseInt(time);
const today = date.getDate();
date.setDate(date.getDate() + 1);
const tomorrow = date.getDate();
console.log(today, time, tomorrow);
let meal;
let day = today;
/* ============================================= */

// POST meal order with time condition  from User section
router.post("/", checkLogin, async (req, res) => {
  /* ===============[ Set Meal Condition ]================= */
  if (time > 4 && time < 12) {
    meal = "Lunch";
  } else if (time > 13 && time < 18) {
    meal = "Dinner";
  } else if (time > 19 || time <= 23) {
    meal = "Breakfast";
    day = tomorrow;
  }
  if (
    time < 5 ||
    time === 10 ||
    time === 11 ||
    time === 12 ||
    time === 13 ||
    time === 18 ||
    time === 19
  ) {
    console.log({ message: "It's not meal order time" });
  } else {
    var user = await User.findOne({ _id: req.userId });
    var order = await Meal.findOne({
      user: req.userId,
      meal: meal,
      date: today,
    });
    if (order) console.log("Order has been placed Already.");
    else {
      var newMeal = await new Meal({
        ...req.body,
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
        .then(() => console.log(`${newMeal.meal} order for ${newMeal.time}`))
        .catch(() => console.log("Oops! Something went wrong!"));
    }
  }
});

// UPDATE confirm meal received status from User section
router.put("/:id", checkAdminLogin, checkLogin, async (req, res) => {
  let date = new Date().getDate();
  const admin = await Admin.findOne({ _id: req.adminId }).select("role");
  if (req.userId || admin.role === "warden") {
    await Meal.updateOne(
      {
        _id: req.params.id, date: date.toString(),
        status: false,
      },
      {
        $set: { status: true },
      }
    )
      .then(() => console.log("Meal has been served", date))
      .catch(() => res.json("Oops! Something went wrong!"));
  }
});


// GET all meal orders from Admin section
router.get("/", checkAdminLogin, async (req, res) => {
  let query = {};
  if (req.query.date && req.query.meal) {
    query = {
      meal: req.query.meal,
      date: req.query.date,
    };
  } else if (req.query.date) {
    query = { date: req.query.date };
  }
  await Meal.find(query)
    .sort({ _id: -1 })
    // .populate("user", "matric dept room name")
    .populate({
      path: "user",
      select: "matric dept room name",
      populate: {
        path: "room",
        select: "room",
      },
    })
    .then((data) => res.json(data))
    .catch(() => res.json("Oops! Something went wrong!"));
});

module.exports = router;
