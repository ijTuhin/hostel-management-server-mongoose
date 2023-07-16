const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkAdminLogin = require("../Authentications/checkAdminLogin.js");
const checkLogin = require("../Authentications/checkLogin.js");
const paymentSchema = require("../collectionSchemas/paymentSchema.js");
const Payment = new mongoose.model("Payment", paymentSchema);
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);
const balanceSheetSchema = require("../collectionSchemas/balanceSheetSchema.js");
const BalanceSheet = new mongoose.model("BalanceSheet", balanceSheetSchema);
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

// POST Meal Bill Payment
router.post("/meal-package", checkLogin, async (req, res) => {
  const payment = await Payment.findOne({
    user: req.userId,
    item: "meal",
    date: new Date().toLocaleDateString(),
  });
  if (!payment) {
    await Payment.find({
      user: req.userId,
      month: month,
      item: "meal",
      package: 2,
    })
      .then(async (data) => {
        if (data.length < 3 || req.body.package !== 2) {
          const user = await User.findOne({ _id: req.userId });
          const package = req.body.package;
          const newPayment = await new Payment({
            ...req.body,
            item: "meal",
            bill: package * 70,
            user: req.userId,
          }).save();
          await User.updateOne(
            { _id: req.userId },
            {
              $push: { payments: newPayment._id },
              $set: {
                meal: 1,
                coupon: user.coupon + newPayment.package*3,
              },
            }
          );
          await BalanceSheet.updateOne(
            { status: 1 },
            {
              $push: { mealBill: newPayment._id }
            }
          );
          res.json(
            `Payment Successfull with ${newPayment.package} days package`
          );
          console.log(`Payment Successfull with ${newPayment.package} days package`)
        } else res.json(`Oopss! Payment unsuccessfull!`);
      })
      .catch(() => res.json(req.body));
  }
});
// POST Seat Rent Payment
router.post("/seat-rent", checkLogin, async (req, res) => {
  const payment = await Payment.findOne({
    user: req.userId,
    item: "rent",
    month: month,
  });
  if (!payment) {
    var newPayment = await new Payment({
      ...req.body,
      bill: 2500,
      item: "rent",
      user: req.userId,
    }).save();
    await User.updateOne(
      { _id: req.userId },
      {
        $push: {
          payments: newPayment._id,
        },
        $set: {
          rent: 1,
        },
      }
    );
    await BalanceSheet.updateOne(
      { status: 1 },
      {
        $push: { seatRent: newPayment._id }
      }
    )
      .then(() => {
        res.status(201).json({
          message: "Seat rent paid",
        });
      })
      .catch(() => {
        res.status(400).json({
          error: "Oops! Something went wrong!",
        });
      });
  }
});

// GET payment record from Admin Side
router.get("/", checkAdminLogin, async (req, res) => {
  let query = {};
  if (req.query.month && req.query.item) {
    query = {
      item: req.query.item,
      month: req.query.month,
    };
  } else if (req.query.item) {
    query = {
      item: req.query.item,
    };
  }
  await Payment.find(query)
    .sort({ _id: -1 })
    .populate("user", "matric dept room coupon")
    .then((data) => {
      res.status(201).json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

module.exports = router;
