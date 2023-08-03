const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const router = express.Router();
const adminSchema = require("../collectionSchemas/adminSchema.js");
const Admin = new mongoose.model("Admin", adminSchema);
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);
const checkAdminLogin = require("../Authentications/checkAdminLogin.js");
const checkLogin = require("../Authentications/checkLogin.js");
const messageSchema = require("../collectionSchemas/messageSchema.js");
const Message = new mongoose.model("Message", messageSchema);
const noticeSchema = require("../collectionSchemas/noticeSchema.js");
const Notice = new mongoose.model("Notice", noticeSchema);

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
  const user = await User.findOne({ email: req.body.email });
  const admin = await Admin.findOne({ email: req.body.email });
  const newNotice = await new Notice({
    ...req.body,
    to: user.matric,
    notice: `You have been selected as Meal Manager. Please, Contact Warden.`,
    sender: req.adminId,
  }).save();
  await User.updateOne(
    { email: req.body.email },
    {
      $set: { role: true },
      $push: { notice: newNotice._id },
    }
  );
  if (admin) {
    await Admin.updateOne({ email: req.body.email }, { $set: { status: true } })
      .then(() => {
        res.status(201).json({ msg: "Meal Manager created" });
      })
      .catch(() => {
        res.status(400).json({
          error: "Oops! Something went wrong!",
        });
      });
  } else {
    await new Admin({
      ...req.body,
      role: "meal",
      month: month,
      status: true,
    })
      .save()
      .then(() => {
        res.status(201).json({ msg: "Meal Manager created" });
      })
      .catch(() => {
        res.status(400).json({
          error: "Oops! Something went wrong!",
        });
      });
  }
});
router.post("/remove-meal-manager", async (req, res) => {
  const user = await User.findOne({ matric: req.body.matric });
  await Admin.updateOne(
    { role: "meal", status: true, email: user.email },
    { $set: { status: false } }
  );
  await User.updateOne({ matric: req.body.matric }, { $set: { role: false } })
    .then(() => {
      res.status(200).json("Meal Manager removed");
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
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
    const admin = await Admin.findOne({ email: req.body.email });
    const user = await User.findOne({
      email: req.body.email,
      role: true,
    });
    if (admin) {
      const token = jwt.sign(
        {
          email: admin.email,
          adminId: admin._id,
        },
        process.env.SECRET_JWT_TOKEN,
        {
          expiresIn: "10h",
        }
      );

      res.status(200).json({
        token: token,
        role: admin.role,
        time: Date.now().toString(),
        message: "Login Successful",
      });
      // console.log(admin)
    } else console.log("User not found");
  } catch {
    console.log("Not found.");
    res.status(401).json("Authentication Failed");
  }
});

router.post("/edit-request", checkLogin, async (req, res) => {
  await Admin.updateMany(
    { role: "warden" },
    {
      // $push: {
      //   edit: {
      //     ...req.body,
      //     user: req.userId,
      //   },
      // },
      $push: {
        edit: {
          $each: [
            {
              ...req.body,
              user: req.userId,
            },
          ],
          $sort: -1,
        },
      },
    }
  )
    .then(() => {
      res.status(200).json(`Edit request posted to Warden`);
      console.log(`Edit request posted to Warden`);
    })
    .catch(() => res.json("Oops! Something went wrong!"));
});

router.put("/request-approve/:id", checkAdminLogin, async (req, res) => {
  const data = await Admin.findOne({
    role: "warden",
  }).select("edit");
  const check = data.edit.filter((i) => i.user === req.params.id);
  if (check.length) {
    await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          phone: check[0]?.phone,
          thana: check[0]?.thana,
          district: check[0]?.district,
          address: check[0]?.address,
        },
      }
    );
    await Admin.updateMany(
      { role: "warden" },
      {
        $pull: { edit: { user: req.params.id } },
      }
    );
    await Message.updateMany(
      { no: 1, sender: req.params.id },
      { $set: { solved: true } }
    ).then(() => {
      res.status(200).json("true");
      console.log("Added");
    });
  } else {
    res.json(`can't fine ${req.params.id} data`);
    console.log(`can't fine ${req.params.id} data`, check);
  }
});

// GET Messages
router.get("/edit-request", checkAdminLogin, async (req, res) => {
  const admin = await Admin.findOne({
    _id: req.adminId,
    role: "warden",
  })
    .select("edit")
    .populate({
      path: "edit",
      populate: {
        path: "user",
        select: "matric room",
        populate: { path: "room", select: "room" },
      },
      // path:"room",
      // populate:"room"
    })
    .then((data) => res.json(data))
    .catch(() => res.json("Oops! Something went wrong!"));
});
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
