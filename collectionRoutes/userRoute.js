const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const router = express.Router();
const checkAdminLogin = require("../Authentications/checkAdminLogin.js");
const checkLogin = require("../Authentications/checkLogin.js");
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);
const paymentSchema = require("../collectionSchemas/paymentSchema.js");
const Payment = new mongoose.model("Payment", paymentSchema);
const mealSchema = require("../collectionSchemas/mealSchema");
const Meal = new mongoose.model("Meal", mealSchema);
const messageSchema = require("../collectionSchemas/messageSchema.js");
const Message = new mongoose.model("Message", messageSchema);
const noticeSchema = require("../collectionSchemas/noticeSchema.js");
const Notice = new mongoose.model("Notice", noticeSchema);
const seatSchema = require("../collectionSchemas/seatSchema.js");
const Seat = new mongoose.model("Seat", seatSchema);
const attendanceSchema = require("../collectionSchemas/attendanceSchema");
const Attendance = new mongoose.model("Attendance", attendanceSchema);
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

// Create user from Admin section
router.post("/signup", checkAdminLogin, async (req, res) => {
  const newUser = new User(req.body);
  await newUser
    .save()
    .then(() => {
      res.status(200).json({
        error: "Insertion successful",
      });
    })
    .catch((e) => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
        e,
      });
    });
});
// User Login from User section
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      account: true,
    });
    if (user) {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.SECRET_JWT_TOKEN,
        {
          expiresIn: "10h",
        }
      );
      res.status(200).json({
        token: token,
        time: Date.now().toString(),
        message: "Login Successful",
      });
      console.log(token);
    } else res.status(401).send({ acc: 0, msg: "Account has been blocked" });
  } catch {
    res.status(401).json("Authentication Failed");
  }
});

// Get individual user data on Load from User section
router.get("/my-data", checkLogin, async (req, res) => {
  const user = await User.findOne({ _id: req.userId }).select({
    password: 0,
    meal: 0,
    rent: 0,
    __v: 0,
    payments: 0,
    orders: 0,
    attendance: 0,
    notice: 0,
    message: 0,
  });
  const message = await Message.find({ sender: req.userId })
    .populate("reply.from", "name")
    .sort({ _id: -1 });
  const notice = await Notice.find({
    $or: [{ to: req.userId }, { to: "All User" }],
  })
    .populate("sender", "role name")
    .sort({ _id: -1 });
  const payments = await Payment.find({ user: req.userId }).sort({ _id: -1 });
  const orders = await Meal.find({ user: req.userId }).sort({ _id: -1 });
  const attendance = await Attendance.find({ user: req.userId }).sort({
    _id: -1,
  });
  const room = await Seat.findOne({ _id: user.room })
    .populate("member", "name dept sem matric")
    .select("room member")
    .then((data) => {
      res.status(200).json({
        user,
        payments,
        orders,
        attendance,
        notice,
        message,
        room: data,
      });
      console.log("Got data");
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
      res.status(500).json({
        error: "Oops! Status 500!! Something went wrong!",
      });
    });
});

// GET all data from Admin section
router.get("/", checkAdminLogin, async (req, res) => {
  await User.find({})
    .sort({ "room.room": -1 })
    .select(
      "matric name enroll sem dept room email account status phone address thana district program role"
    )
    .populate("room", "room")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

// GET searched user from Admin section
router.get("/search", checkAdminLogin, async (req, res) => {
  await User.find({
    $or: [{ matric: req.query.matric }, { name: req.query.name }],
  })
    .populate("room", "room")
    .sort({ _id: -1 })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});
// GET all user attendance from Admin section
router.get("/attendance", checkAdminLogin, async (req, res) => {
  await User.find({})
    .populate("attendance", "_id")
    .populate("room", "room")
    .select("matric dept attendance room")
    .sort({ "room.room": -1 })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

// UPDATE user data from Admin section
router.put("/update/:id", checkAdminLogin, async (req, res) => {
  await User.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: req.body?.name,
        matric: req.body?.matric,
        current: req.body?.current,
        sem: req.body?.sem,
        phone: req.body?.phone,
        district: req.body?.district,
        address: req.body?.address,
        thana: req.body?.thana,
        dept: req.body?.dept,
        program: req.body?.program,
      },
    }
  )
    .then(() => console.log("Updated", req.body))
    .catch(() => console.log("Could not Update", req.body));
});

// UPDATE account validity from Admin section
router.put("/account/:id", checkAdminLogin, async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (user.account)
    await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          account: false,
        },
      }
    )
      .then(() => res.json("Account invalidated"))
      .catch(() => res.json("Could not Update"));
  else
    await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          account: true,
        },
      }
    )
      .then(() => res.json("Account validated"))
      .catch(() => res.json("Could not Update"));
});


module.exports = router;
