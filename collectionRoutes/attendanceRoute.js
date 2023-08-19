const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkLogin = require("../Authentications/checkLogin.js");
const checkAdminLogin = require("../Authentications/checkAdminLogin.js");
const attendanceSchema = require("../collectionSchemas/attendanceSchema");
const Attendance = new mongoose.model("Attendance", attendanceSchema);
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);

// POST new attendance from User section
router.post("/", checkLogin, async (req, res) => {
  const existing = await Attendance.findOne({
    date: new Date().toLocaleDateString(),
    user: req.userId,
  });
  if (!existing) {
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
      .then(() => res.json({ message: "Attendance Marked" }))
      .catch(() => res.json("Oops! Something went wrong!"));
  } else res.json({ message: "Already Marked Attendance" });
});

module.exports = router;
