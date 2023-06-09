const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkLogin = require("../Authentications/checkLogin.js");
const messageSchema = require("../collectionSchemas/messageSchema.js");
const Message = new mongoose.model("Message", messageSchema);
const adminSchema = require("../collectionSchemas/adminSchema.js");
const Admin = new mongoose.model("Admin", adminSchema);
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);

// POST new Message
router.post("/", checkLogin, async (req, res) => {
  let text = `Assalamu Alaikum ${req.body.to} Sir/ Ma'am, ${req.body.message} Thank You.`;
  const newMessage = await new Message({
    ...req.body,
    message: text,
    sender: req.userId,
  }).save();
  await User.updateOne(
    { _id: req.userId },
    {
      $push: { message: newMessage._id },
    }
  );
  await Admin.updateOne(
    { role: req.body.to },
    {
      $push: { message: newMessage._id },
    }
  )
    .then(() => res.json(`Message sent to ${req.body.to}`))
    .catch(() => res.json("Oops! Something went wrong!"));
});

// GET by sender
router.get("/", checkLogin, async (req, res) => {
  await Message.find({ sender: req.userId })
    .populate("reply.from", "name")
    .sort({ _id: -1 })
    .then((data) => res.json(data))
    .catch(() => res.json("Oops! Something went wrong!"));
});

// DELETE message by ID
router.delete("/:id", checkLogin, async (req, res) => {
  await Message.deleteOne({ _id: req.params.id, sender: req.userId })
    .then(() => res.json("Message deleted"))
    .catch(() => res.json("Oops! Something went wrong!"));
});

module.exports = router;
