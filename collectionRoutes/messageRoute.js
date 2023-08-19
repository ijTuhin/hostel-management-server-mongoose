const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkLogin = require("../Authentications/checkLogin.js");
const checkAdminLogin = require("../Authentications/checkAdminLogin.js");
const messageSchema = require("../collectionSchemas/messageSchema.js");
const Message = new mongoose.model("Message", messageSchema);
const adminSchema = require("../collectionSchemas/adminSchema.js");
const Admin = new mongoose.model("Admin", adminSchema);
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);

// POST new Message from User section
router.post("/", checkLogin, async (req, res) => {
  const newMessage = await new Message({
    ...req.body,
    sender: req.userId,
  }).save();
  await User.updateOne(
    { _id: req.userId },
    {
      $push: { message: newMessage._id },
    }
  )
    .then(() => res.json(`Message sent to ${req.body.to}`))
    .catch(() => res.json("Oops! Something went wrong!"));
  if (req.body.to === "warden") {
    await Admin.updateOne(
      { role: req.body.to },
      {
        $push: { message: newMessage._id },
      }
    );
  } else {
    await Admin.updateMany(
      { $nor: [{ role: "meal" }] },
      {
        $push: { message: newMessage._id },
      }
    );
  }
});
// GET user complaints from Admin section
router.get("/", checkAdminLogin, async (req, res) => {
  await Message.find({ solved: false })
    .populate({
      path: "sender",
      select: "matric room",
      populate: {
        path: "room",
        select: "room",
      },
    })
    .sort({ _id: -1 })
    .then((data) => {
      res.json(data);
    });
});
// SENT reply to complaints from Admin section
router.put("/reply/:id", checkAdminLogin, async (req, res) => {
  await Message.updateOne(
    { _id: req.params.id },
    {
      $set: { reply: req.body.reply },
    }
  );
});
// SOLVE complaints from Admin section
router.put("/solve/:id", checkAdminLogin, async (req, res) => {
  await Message.updateOne(
    { _id: req.params.id },
    {
      $set: { solved: true },
    }
  );
});

module.exports = router;
