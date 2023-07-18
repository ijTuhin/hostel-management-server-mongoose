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
const today = date.toLocaleDateString();
date.setDate(date.getDate() + 1);
const tomorrow = date.toLocaleDateString();
console.log(today, time, tomorrow);
let meal;
let day = today;
/* ============================================= */

// POST meal order with time condition
router.post("/", checkLogin, async (req, res) => {
  /* ===============[ Set Meal Condition ]================= */
  if (time > 4 && time < 10) {
    meal = "Lunch";
  } else if (time > 13 && time < 18) {
    meal = "Dinner";
  } else if (time > 19 || time <= 23) {
    meal = "Breakfast";
    day = tomorrow;
  }
  /* ====================================================== */
  if (
    time < 5 ||
    time === 10 ||
    time === 11 ||
    time === 12 ||
    time === 13 ||
    time === 18 ||
    time === 19
  ) {
    res.json({ message: "It's not meal order time" });
  } else {
    var user = await User.findOne({ _id: req.userId });
    var order = await Meal.findOne({
      user: req.userId,
      meal: meal,
      date: today,
    });
    if (order) res.json("Order has been placed Already.");
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
        .then(() => res.json(`${newMeal.meal} order for ${newMeal.date}`))
        .catch(() => res.json("Oops! Something went wrong!"));
    }
  }
});

// UPDATE received status by Id
router.put("/:id", checkAdminLogin, checkLogin, async (req, res) => {
  /* ===============[ Set Order Condition ]================= */
  // if (time > 11 && time < 17) {
  //   meal = "Lunch";
  // } else if (time > 19 && time <= 23) {
  //   meal = "Dinner";
  // } else if (time > 4 || time < 12) {
  //   meal = "Breakfast";
  // } else meal = null;
  /* ====================================================== */
  const admin = await Admin.findOne({ _id: req.adminId }).select("role");
  if (req.userId || admin.role === "warden") {
    await Meal.updateOne(
      { _id: req.params.id, /* meal: meal, */ date: today },
      {
        $set: { status: true },
      }
    )
      .then(() => res.status(201).json("Meal has been served"))
      .catch(() => res.json("Oops! Something went wrong!"));
  }
});

// DELETE meal request by ID
router.delete("/:id", checkAdminLogin, checkLogin, async (req, res) => {
  /* ===============[ Set Meal Cancel Condition ]================= */
  if (time > 4 && time < 10) {
    meal = "Lunch";
  } else if (time > 13 && time < 18) {
    meal = "Dinner";
  } else if (time > 19 || time <= 23) {
    meal = "Breakfast";
    day = tomorrow;
  } else meal = null;
  /* ====================================================== */
  if (meal) {
    const user = await User.findOne({ _id: req.userId });
    await Meal.deleteOne({
      _id: req.params.id,
      status: false,
      meal: meal,
      date: today,
    })
      .then(async () => {
        await User.updateOne(
          { _id: req.userId },
          { $set: { coupon: user.coupon + 1 } }
        ).then(() => res.json("Deleted"));
      })
      .catch(() => res.json("Oops! Something went wrong!"));
  } else {
    res.json("Cannot delete order now!");
  }
});

// GET all
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
    .populate("user", "matric dept room name")
    .then((data) => res.json(data))
    .catch(() => res.json("Oops! Something went wrong!"));
});

module.exports = router;
