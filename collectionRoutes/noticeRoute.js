const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkAdminLogin = require("../Authentications/checkAdminLogin.js");
const checkLogin = require("../Authentications/checkLogin.js");
const noticeSchema = require("../collectionSchemas/noticeSchema.js");
const Notice = new mongoose.model("Notice", noticeSchema);
const adminSchema = require("../collectionSchemas/adminSchema.js");
const Admin = new mongoose.model("Admin", adminSchema);
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);

// POST new Notice from Admin section
router.post("/", checkAdminLogin, async (req, res) => {
  let text = `Dear ${req.body.to}, ${req.body.notice} Thank You.`;
  function isMatric(str) {
    return /[0-9]/.test(str);
  }
  const newNotice = await new Notice({
    ...req.body,
    notice: text,
    sender: req.adminId,
  }).save();

  await Admin.updateOne(
    { _id: req.adminId },
    {
      $push: { posted: newNotice._id },
    }
  )
    .then(() => res.json("Notice Marked"))
    .catch(() => res.json("Oops! Something went wrong!"));

  if (isMatric(req.body.to)) {
    await User.updateOne(
      { matric: req.body.to },
      {
        $push: { notice: newNotice._id },
      }
    );
  } else if (req.body.to === "All Users") {
    await User.updateMany(
      {},
      {
        $push: { notice: newNotice._id },
      }
    );
  } else {
    const senderAdmin = await Admin.findOne({ _id: req.adminId });
    console.log(senderAdmin.role, req.body.to);
    if (senderAdmin.role !== req.body.to) {
      await Admin.updateMany(
        { role: req.body.to },
        {
          $push: { notice: newNotice._id },
        }
      );
    } else {
      await Admin.updateMany(
        { $nor: [{ _id: senderAdmin._id }], role: req.body.to },
        {
          $push: { notice: newNotice._id },
        }
      );
    }
  }
});

// GET sent notices from Admin section by sender
router.get("/", checkAdminLogin, async (req, res) => {
  console.log(req.adminId);
  await Notice.find({ sender: req.adminId })
    .sort({ _id: -1 })
    .then((data) => res.json(data))
    .catch(() => res.json("Oops! Something went wrong!"));
});


// GET notice from Admin section
router.get("/get", checkAdminLogin, async (req, res) => {
  await Admin.findOne({ _id: req.adminId })
    .sort({ _id: -1 })
    .select("notice")
    .populate({
      path: "notice",
      select: "title sender notice date month",
      populate: {
        path: "sender",
        select: "role",
      },
    })
    .then((data) => res.json(data.notice))
    .catch(() => res.json("Oops! Something went wrong!"));
});

module.exports = router;
