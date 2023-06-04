const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkLogin = require("../Authentications/checkLogin.js");
const paymentSchema = require("../collectionSchemas/paymentSchema.js");
const Payment = new mongoose.model("Payment", paymentSchema);
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);
const balanceSheetSchema = require("../collectionSchemas/balanceSheetSchema.js");
const BalanceSheet = new mongoose.model ("BalanceSheet", balanceSheetSchema);

// POST new payment and update in User collection
router.post("/rent", checkLogin, async (req, res) => {
  if (req.body.item === "rent") {
    const newPayment = new Payment({
      ...req.body,
      user: req.userId,
    });
    console.log(newPayment);
    const payment = await newPayment.save();
    await User.updateOne(
      { _id: req.userId, rent: 0 },
      {
        $push: {
          payments: payment._id,
        },
        $set: {
          rent: 1,
        },
      }
    );
    await BalanceSheet.updateOne(
      { status: 1 },
      {$push: {seatRent: payment._id,}}
    )
      .then(async () => {
        res.status(200).json({
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

// GET by payment id
router.get("/:id", async (req, res) => {
  await Payment.find({ _id: req.params.id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});



// GET payment according to query
router.get("/", async (req, res) => {
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
    .populate("user", "matric dept room meal rent")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

// GET all
router.get("/", async (req, res) => {
  console.log("Email: ", req.email);
  await Payment.find({})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

// DELETE by ID
router.delete("/:id", async (req, res) => {
  await Payment.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        result: "Data deletion successful",
      });
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});


module.exports = router;
