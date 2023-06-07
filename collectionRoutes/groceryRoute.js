const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const grocerySchema = require("../collectionSchemas/grocerySchema");
const Grocery = new mongoose.model("Grocery", grocerySchema);
const balanceSheetSchema = require("../collectionSchemas/balanceSheetSchema");
const BalanceSheet = new mongoose.model("BalanceSheet", balanceSheetSchema);

// POST new date record
router.post("/", async (req, res) => {
  const record = await Grocery.find({ date: req.query.date });
  if (!record.length) {
    const newGrocery = await new Grocery(req.body).save();
    await BalanceSheet.updateOne(
      { status: 1 },
      { $push: { grocery: newGrocery._id } }
    )
      .then((data) => res.json(data))
      .catch(() => res.json("Please check the error!!"));
  }
  else res.json('Grocery record exists')
});

// GET all data or data by month or date
router.get("/", async (req, res) => {
  let query = {};
  if (req.query.month) {
    query = { month: req.query.month };
  } else if (req.query.date) {
    query = { date: req.query.date };
  }
  await Grocery.find(query)
    .then((data) => {
      res.json(data);
    })
    .catch(() => res.json("Please check the error!!"));
});

// Add new grocery items to current date
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
  if (item.length) {
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
      { $push: { list: req.body.list }, $set: { total } }
    )
      .then(() => res.json("New Grocery item added"))
      .catch(() => res.json("Please check the error!!3"));
  }
});

// Update item of list by ID
/* router.put("/list/:id", async (req, res) => {
  await Grocery.updateOne(
    { "list._id": req.params.id },
    {
      $set: {
        "list.$.name": req.body.name,
        "list.$.amount": req.body.amount,
        "list.$.price": req.body.price,
      },
    }
  )
    .then(() => res.json("Grocery item updated"))
    .catch(() => res.json("Please check the error!!"));
}); */

// delete item from list by ID
/* router.put("/remove-list/:id", async (req, res) => {
  const itemID = req.params.id;
  await Grocery.updateOne(
    { "list._id": req.params.id },
    {
      $pull: {
        list: { _id: itemID },
      },
    }
  )
    .then(() => res.json("Grocery item deleted"))
    .catch(() => res.json("Please check the error!!"));
}); */

module.exports = router;
