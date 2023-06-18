const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const router = express.Router();
const adminSchema = require("../collectionSchemas/adminSchema.js");
const Admin = new mongoose.model("Admin", adminSchema);
const checkAdminLogin = require("../Authentications/checkAdminLogin.js");
const messageSchema = require("../collectionSchemas/messageSchema.js");
const Message = new mongoose.model("Message", messageSchema);

// Meal Manager SIGN-UP & LOG IN
router.post("/create-meal-manager", async (req, res) => {
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
  const month = months[new Date().getMonth()] + "-" + new Date().getFullYear();
  await Admin.updateOne({ role: "meal", status: 1 }, { $set: { status: 0 } });
  await new Admin({
    ...req.body,
    role: "meal",
    month: month,
    status: 1,
  })
    .save()
    .then(() => {
      res.status(200).json("Meal Manager created");
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});
router.post("/meal/login", async (req, res) => {
  try {
    const admin = await Admin.find({
      role: "meal",
      email: req.body.email,
      status: 1,
    });
    if (admin && admin.length > 0) {
      if (admin[0].status) {
        const token = jwt.sign(
          {
            email: admin[0].email,
            adminId: admin[0]._id,
          },
          process.env.SECRET_JWT_TOKEN,
          {
            expiresIn: "10h",
          }
        );
        res.status(200).json({
          token: token,
          role: "meal",
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
            expiresIn: "10h",
          }
        );

        res.status(200).json({
          token: token,
          role: admin[0].role,
          message: "Login Successful",
        });
      } else res.status(401).json("Authentication Failed");
    } else res.status(401).json("Authentication Failed");
  } catch {
    res.status(401).json("Authentication Failed");
  }
});

// GET Messages
router.get("/message", checkAdminLogin, async (req, res) => {
  const admin = await Admin.findOne({ _id: req.adminId }).select("role");
  await Message.find({ to: admin.role })
    .populate("reply.from", "name")
    .populate("sender", "matric name")
    .sort({ _id: -1 })
    .then((data) => res.json(data))
    .catch(() => res.json("Oops! Something went wrong!"));
});

// POST reply to message
router.put("/message/:id", checkAdminLogin, async (req, res) => {
  const admin = await Admin.findOne({ _id: req.adminId }).select("role");
  await Message.updateOne(
    { to: admin.role, _id: req.params.id },
    {
      $set: {
        reply: {
          text: req.body.reply.text,
          from: req.adminId,
        },
      },
    }
  )
    .then(() => res.json(`Replied to the message`))
    .catch(() => res.json("Oops! Something went wrong!"));
});

module.exports = router;
