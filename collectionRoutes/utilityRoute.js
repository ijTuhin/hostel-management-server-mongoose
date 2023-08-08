const express = require("express");
const mongoose = require("mongoose");
const SSLCommerzPayment = require("sslcommerz-lts");
const router = express.Router();
const utilitySchema = require("../collectionSchemas/utilitySchema");
const Utility = new mongoose.model("Utility", utilitySchema);
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
const m = new Date().getMonth();
const previous = months[m - 1] + "-" + new Date().getFullYear();
const month = months[m] + "-" + new Date().getFullYear();
const date = new Date().toLocaleDateString();

// GET by month
router.get("/", async (req, res) => {
  let query = {};
  if (req.query.month) {
    query = { month: req.query.month };
  } else if (req.query.name) {
    query = { name: req.query.name };
  }
  await Utility.find(query)
    .sort({ _id: -1 })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

// GET by Id
router.get("/:id", async (req, res) => {
  await Utility.find({ _id: req.params.id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

// POST new Utility record
router.post("/", async (req, res) => {
  const current = await Utility.find({ month: month });
  if (!current.length) {
    const last = await Utility.find({ month: previous });
    const value = last.map((i) => {
      let items;
      if (i.status) {
        items = {
          due: {
            bill: i.status * i.bill,
            id: i._id,
          },
          name: i.name,
        };
      } else {
        items = {
          name: i.name,
        };
      }
      return items;
    });
    await Utility.insertMany(value);
    await new BalanceSheet(req.body).save();
    await BalanceSheet.updateOne(
      { month: previous, status: 1 },
      { $set: { status: 0 } }
    )
      .then((data) => {
        res.status(200).json({
          data,
        });
      })
      .catch(() => {
        res.status(400).json({
          error: "Oops! Something went wrong!",
        });
      });
  } else res.json("Utility Record exists");
});

// UPDATE utility bill & status
router.put("/insert-bill/:id", async (req, res) => {
  // From Warden Panel
  await Utility.updateOne(
    { _id: req.params.id, status: 1, bill: 0 },
    {
      $set: {
        bill: req.body.bill,
      },
    }
  )
    .then(() => {
      res.status(200).json({
        result: "Data update successful",
      });
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});
router.put("/pay-due/:id", async (req, res) => {
  // From Finance Panel
  const item = await Utility.findOne({ _id: req.params.id });
  const store_id = process.env.SSL_STORE_ID;
  const store_passwd = process.env.SSL_STORE_PASS;
  const trxID = "Txr" + Math.random().toString(36).substring(4, 11) + "kdz";
  const is_live = false;
  const data = {
    total_amount: item.bill,
    currency: "BDT",
    tran_id: trxID,
    success_url: `http://localhost:3001/utility/success/${trxID}`,
    fail_url: "http://localhost:3001/fail",
    cancel_url: "http://localhost:3001/cancel",
    ipn_url: "http://localhost:3001/ipn",
    shipping_method: "Payment",
    product_name: item.name,
    product_category: "Bill",
    product_profile: "Utility",
    cus_name: item.name,
    cus_email: "customer@example.com",
    cus_add1: "Ctg, Bangladesh",
    cus_phone: "0139999999",
    ship_name: item.name,
    ship_add1: "Ctg, Bangladesh",
    ship_city: "Chattogram",
    ship_postcode: 4200,
    ship_country: "Bangladesh",
  };
  console.log(data);
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.init(data).then((apiResponse) => {
    let GatewayPageURL = apiResponse.GatewayPageURL;
    res.send({ url: GatewayPageURL });
    console.log("Redirecting to: ", GatewayPageURL);
  });

  router.post("/success/:trxId", async (req, res) => {
    if (item.due.bill > 0) {
      await Utility.updateOne(
        { _id: item.due.id, status: 1 },
        {
          $set: { status: 0, date: date, trxID: req.params.trxId },
        }
      );
    }
    await Utility.updateOne(
      { _id: item._id, status: 1 },
      {
        $set: { status: 0, date: date, trxID: req.params.trxId },
      }
    );
    await BalanceSheet.updateOne(
      { status: 1 },
      {
        $push: { utility: item._id },
      }
    )
      .then(() => {
        console.log({
          result: "Bill Paid",
        });
        res.redirect(`http://localhost:3000`)
      })
      .catch(() => {
        console.log({
          error: "Oops! Something went wrong!",
        });
      });
  });
});

module.exports = router;
