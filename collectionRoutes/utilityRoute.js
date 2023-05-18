const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const utilitySchema = require("../collectionSchemas/utilitySchema")
const Utility = new mongoose.model("Utility", utilitySchema)

module.exports = router;