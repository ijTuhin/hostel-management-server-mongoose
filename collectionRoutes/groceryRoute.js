const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const grocerySchema = require("../collectionSchemas/grocerySchema");
const Grocery = new mongoose.model("Grocery", grocerySchema);
const balanceSheetSchema = require("../collectionSchemas/balanceSheetSchema.js");
const BalanceSheet = new mongoose.model ("BalanceSheet", balanceSheetSchema);

// POST new month
router.post("/", async (req, res) => {
  const newGrocery = await new Grocery(req.body).save();
  await BalanceSheet.updateOne(
    { status: 1 },
    { $push: { grocery: newGrocery._id } }
  )
    .then(() => res.json("New Grocery Bucket created"))
    .catch(() => res.json("Please check the error!!"));
});

// GET all data or data by month
router.get("/", async (req, res) => {
  let cost = 0;
  let query = {};
  if (req.query.month) {
    query = { month: req.query.month };
  }
  await Grocery.find(query)
    .then((data) => {
      data.map(i => {
        cost = cost + i.cost;
        console.log(i.cost)
      });
      res.json({
        data,
        total: cost
      })
    })
    .catch(() => res.json("Please check the error!!"));
});

// Update item of list by ID
router.put("/:id", async (req, res) => {
  await Grocery.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        amount: req.body.amount,
        cost: req.body.cost,
        rate: req.body.rate,
      },
    }
  )
    .then(() => res.json("Grocery item updated"))
    .catch(() => res.json("Please check the error!!"));
});

// delete item from list by ID
router.delete("/:id", async (req, res) => {
  await Grocery.deleteOne({ _id: req.params.id })
    .then(() => res.json("Grocery item deleted"))
    .catch(() => res.json("Please check the error!!"));
});

module.exports = router;
