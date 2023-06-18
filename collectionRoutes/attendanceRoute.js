const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkLogin = require("../Authentications/checkLogin.js");
const attendanceSchema = require("../collectionSchemas/attendanceSchema");
const Attendance = new mongoose.model("Attendance", attendanceSchema);
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);

// POST new attendance
router.post("/", checkLogin, async (req, res) => {
  const newAttendance = await new Attendance({
    ...req.body,
    user: req.userId,
  }).save();
  await User.updateOne(
    { _id: req.userId },
    {
      $push: { attendance: newAttendance._id },
    }
  )
    .then(() => res.json("Attendance Marked"))
    .catch(() => res.json("Oops! Something went wrong!"));
});

// DELETE Attendance request by ID
router.delete("/:id", checkLogin, async (req, res) => {
  await Attendance.deleteOne({ _id: req.params.id })
    .then(() => res.json("Attendance deleted"))
    .catch(() => res.json("Oops! Something went wrong!"));
});

// GET by id
router.get("/:id", checkLogin, async (req, res) => {
  await Attendance.findOne({ _id: req.params.id })
    .populate("user", "matric dept room name")
    .then((data) => res.json(data))
    .catch(() => res.json("Oops! Something went wrong!"));
});

// GET by Query
router.get("/", async (req, res) => {
  let query = {};
  if (req.query.date) {
    query = { date: req.query.date }; // http://localhost:3001/attendance?date=${date}
  }
  await Attendance.find(query)
    .sort({ _id: -1 })
    .populate("user", "matric dept room name")
    .then((data) => res.json(data))
    .catch(() => res.json("Oops! Something went wrong!"));
});

module.exports = router;
