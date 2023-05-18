const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const attendanceSchema = require("../collectionSchemas/attendanceSchema")
const Attendance = new mongoose.model("Attendance", attendanceSchema)

module.exports = router