const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const router = express.Router();
const adminSchema = require("../collectionSchemas/adminSchema.js");
const Admin = new mongoose.model("Admin", adminSchema);

// Meal Manager SIGN-UP & LOG IN
router.post("/meal/signup", async (req, res) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const nextMonth =
    months[new Date().getMonth() - 1] + "-" + new Date().getFullYear();
  const newAdmin = new Admin({
    ...req.body,
    role: "meal",
    month: nextMonth,
    status: 1,
  });
  await newAdmin
    .save()
    .then(() => {
      res.status(200).json("Insertion successful");
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});
router.post("/meal/login", async (req, res) => {
  try {
    const admin = await Admin.find({ email: req.body.email });
    if (admin && admin.length > 0) {
      if (admin[0].status) {
        const token = jwt.sign(
          {
            email: admin[0].email,
            adminId: admin[0]._id,
          },
          process.env.SECRET_JWT_TOKEN,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({
          token: token,
          message: "Meal manager login Successful",
        });
      } else res.status(401).json("Authentication Failed");
    } else res.status(401).json("Authentication Failed");
  } catch {
    res.status(401).json("Authentication Failed");
  }
});

// admin SIGN-UP & LOG IN
router.post("/signup", async (req, res) => {
  const newAdmin = new Admin(req.body);
  await newAdmin
    .save()
    .then(() => {
      res.status(200).json("Insertion successful");
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});
router.post("/login", async (req, res) => {
  try {
    const admin = await Admin.find({ email: req.body.email });
    if (admin && admin.length > 0) {
      if (admin[0].password === req.body.password) {
        const token = jwt.sign(
          {
            email: admin[0].email,
            adminId: admin[0]._id,
          },
          process.env.SECRET_JWT_TOKEN,
          {
            expiresIn: "1h",
          }
        );

        res.status(200).json({
          token: token,
          message: "Login Successful",
        });
      } else res.status(401).json("Authentication Failed");
    } else res.status(401).json("Authentication Failed");
  } catch {
    res.status(401).json("Authentication Failed");
  }
});

module.exports = router;
