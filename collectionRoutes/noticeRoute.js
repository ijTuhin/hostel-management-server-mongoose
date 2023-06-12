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

// POST new Notice
router.post("/", checkAdminLogin, async (req, res) => {
  const senderAdmin = await Admin.findOne({ _id: req.adminId });
  function isMatric(str) {
    return /[0-9]/.test(str);
  }
  const newNotice = await new Notice({
    ...req.body,
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
    const matric = req.body.to;
    await User.updateOne(
      { matric: matric },
      {
        $push: { notice: newNotice._id },
      }
    );
  } else if (req.body.to === "warden" || req.body.to === "finance") {
    const admin = req.body.to;
    if (senderAdmin.role !== req.body.to) {
      await Admin.updateMany(
        { role: admin },
        {
          $push: { notice: newNotice._id },
        }
      );
    } else {
      await Admin.updateMany(
        { $nor: [{ _id: senderAdmin._id }], role: admin },
        {
          $push: { notice: newNotice._id },
        }
      );
    }
  } else {
    await User.updateMany(
      {},
      {
        $push: { notice: newNotice._id },
      }
    );
  }
});

module.exports = router;
