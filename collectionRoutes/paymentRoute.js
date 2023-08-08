const express = require("express");
const mongoose = require("mongoose");
const SSLCommerzPayment = require("sslcommerz-lts");
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
  const authID = req.userId;
  const package = req.body.package;
  const phone = req.body.phone;
  const payment = await Payment.findOne({
    user: req.userId,
    item: "meal",
    date: new Date().getDate(),
  });
  const store_id = process.env.SSL_STORE_ID;
  const store_passwd = process.env.SSL_STORE_PASS;
  const trxID = "Txr" + Math.random().toString(36).substring(4, 11) + "kdz";
  const is_live = false;
  const data = {
    total_amount: req.body.package * 70,
    currency: "BDT",
    tran_id: trxID,
    success_url: `http://192.168.0.106:3001/payment/success/${trxID}`,
    fail_url: "http://192.168.0.106:3001/fail",
    cancel_url: "http://192.168.0.106:3001/cancel",
    ipn_url: "http://192.168.0.106:3001/ipn",
    shipping_method: "Payment",
    product_name: req.userId,
    product_category: "Bill",
    product_profile: "Utility",
    cus_name: req.userId,
    cus_email: "customer@example.com",
    cus_add1: "Ctg, Bangladesh",
    cus_phone: "0139999999",
    ship_name: req.userId,
    ship_add1: "Ctg, Bangladesh",
    ship_city: "Chattogram",
    ship_postcode: 4200,
    ship_country: "Bangladesh",
  };
  console.log(data);
  if (!payment) {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse) => {
      let GatewayPageURL = apiResponse.GatewayPageURL;
      res.send({ url: GatewayPageURL });
      console.log("Redirecting to: ", GatewayPageURL);
    });

    router.post("/success/:trxId", async (req, res) => {
      console.log("TrxID: ", req.params.trxId, package, authID);
      const find = await Payment.find({
        user: authID,
        month: month,
        item: "meal",
        package: 2,
      });
      if (find.length < 3 || package !== 2) {
        const user = await User.findOne({ _id: authID });
        const newPayment = await new Payment({
          ...req.body,
          item: "meal",
          bill: package * 70,
          user: authID,
          trxID: req.params.trxId,
          package: package,
          phone: phone
        }).save();
        await BalanceSheet.updateOne(
          { status: 1 },
          {
            $push: { mealBill: newPayment._id },
          }
        );
        await User.updateOne(
          { _id: authID },
          {
            $push: { payments: newPayment._id },
            $set: {
              meal: 1,
              coupon: user.coupon + package * 3,
            },
          }
        ).then(() => {
          console.log('res.redirect(`exp://192.168.0.106:19000`)')
          res.redirect(`exp://192.168.0.106:19000`)
        });
        // res.json(`Payment Successfull with ${newPayment.package} days package`);
        console.log(
          `Payment Successfull with ${newPayment.package} days package`
        );
      } else res.json(`Oopss! Payment unsuccessfull!`);
    });
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
        $push: { seatRent: newPayment._id },
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
    .populate({
      path: "user",
      select: "matric dept room coupon meal",
      populate: {
        path: "room",
        select: "room",
      },
    })
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
