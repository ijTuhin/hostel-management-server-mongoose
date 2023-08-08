const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkAdminLogin = require("../Authentications/checkAdminLogin.js");
const grocerySchema = require("../collectionSchemas/grocerySchema");
const Grocery = new mongoose.model("Grocery", grocerySchema);
const balanceSheetSchema = require("../collectionSchemas/balanceSheetSchema");
const BalanceSheet = new mongoose.model("BalanceSheet", balanceSheetSchema);

// POST new record from Admin section
router.post("/", async (req, res) => {
  const record = await Grocery.findOne({ date: req.query.date });
  if (!record) {
    const newGrocery = await new Grocery(req.body).save();
    await BalanceSheet.updateOne(
      { status: 1 },
      {
        $push: { grocery: newGrocery._id },
      }
    )
      .then((data) => res.json(data))
      .catch(() => res.json("Please check the error!!"));
  } else res.json("Grocery record exists");
});

// GET all data from Admin section
router.get("/", async (req, res) => {
  let query = {};
  if (req.query.month) {
    query = { month: req.query.month };
  } else if (req.query.date) {
    query = { date: req.query.date };
  }
  await Grocery.find(query)
    .sort({ _id: -1 })
    .then((data) => {
      res.json(data);
    })
    .catch(() => res.json("Please check the error!!"));
});

// Add new grocery items to current date from Admin section
router.put("/", async (req, res) => {
  const name = req.body.list.name;
  const data = await Grocery.find({
    date: req.query.date,
  });

  let total = req.body.list.price;
  data[0]?.list.map((i) => {
    total = total + i.price;
  });
  const item = data[0]?.list.filter((i) => {
    if (i.name === name) return true;
  });
  if (item?.length) {
    await Grocery.updateOne(
      { "list._id": item[0]._id },
      {
        $set: {
          "list.$.amount": req.body.list.amount + item[0].amount,
          "list.$.price": req.body.list.price + item[0].price,
          total,
        },
      }
    )
      .then(() => res.json("Grocery item updated"))
      .catch(() => res.json("Please check the error!!1"));
  } else {
    await Grocery.updateOne(
      { date: req.query.date },
      {
        $push: { list: req.body.list },
        $set: { total },
      }
    )
      .then(() => res.json("New Grocery item added"))
      .catch(() => res.json("Please check the error!!3"));
  }
});

module.exports = router;
