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

// POST meal order with time condition
router.post("/order", checkLogin, async (req, res) => {
  /* ================================================
                Set Time Condition
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
  if (time > 4 && time < 10) {
    meal = "Lunch";
  } else if (time > 13 && time < 18) {
    meal = "Dinner";
  } else if (time > 19 || time <= 23) {
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

// UPDATE received status by Id
router.put("/:id", checkAdminLogin, checkLogin, async (req, res) => {
  const admin = await Admin.findOne({ _id: req.adminId }).select("role");
  if (req.userId || admin.role === "warden")
    await Meal.updateOne(
      { _id: req.params.id },
      {
        $set: { status: 1 },
      }
    )
      .then(() => res.json("Meal received"))
      .catch(() => res.json("Oops! Something went wrong!"));
});

// DELETE meal request by ID
router.delete("/:id", checkAdminLogin, checkLogin, async (req, res) => {
  const meal = await Meal.findOne({ _id: req.params.id });
  if (!meal.status) {
    const user = await User.findOne({ _id: req.userId });
    await Meal.deleteOne({ _id: req.params.id, status: 0 })
      .then(async () => {
        await User.updateOne(
          { _id: req.userId },
          { $set: { coupon: user.coupon + 1 } }
        ).then(() => res.json("Deleted"));
      })
      .catch(() => res.json("Oops! Something went wrong!"));
  } else {
    res.json("Meal Served!");
  }
});

// GET by id
router.get("/:id", checkLogin, async (req, res) => {
  await Meal.findOne({ _id: req.params.id })
    .populate("user", "matric dept room name")
    .then((data) => res.json(data))
    .catch(() => res.json("Oops! Something went wrong!"));
});

// GET all
router.get("/", checkAdminLogin, checkLogin, async (req, res) => {
  let query = {};
  if (req.query.date && req.query.meal) {
    query = {
      meal: req.query.meal,
      date: req.query.date,
    }; //http://localhost:3001/meal?meal=${meal}&date=${date}
  } else if (req.query.date) {
    query = { date: req.query.date }; //http://localhost:3001/meal?date=${date}
  }
  if (req.adminId)
    await Meal.find(query)
      .sort({ _id: -1 })
      .populate("user", "matric dept room name")
      .then((data) => res.json(data))
      .catch(() => res.json("Oops! Something went wrong!"));
  if (req.userId)
    await Meal.find({ user: req.userId })
      .sort({ _id: -1 })
      .populate("user", "matric dept room name")
      .then((data) => res.json(data))
      .catch(() => res.json("Oops! Something went wrong!"));
});

module.exports = router;
