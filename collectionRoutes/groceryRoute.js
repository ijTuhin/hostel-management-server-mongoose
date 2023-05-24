const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const grocerySchema = require("../collectionSchemas/grocerySchema");
const Grocery = new mongoose.model("Grocery", grocerySchema);

// POST new month
router.post("/", async (req, res) => {
  const newGrocery = new Grocery(req.body);
  await newGrocery
    .save()
    .then(() => res.json("New Grocery Bucket created"))
    .catch(() => res.json("Please check the error!!"));
});

// GET all data or data by month
router.get("/", async (req, res) => {
  let query = {};
  if (req.query.month) {
    query = { month: req.query.month };
  }
  await Grocery.find(query)
    .then((data) => res.json(data))
    .catch(() => res.json("Please check the error!!"));
});

// Add new grocery items to current month list
router.put("/list", async (req, res) => {
  await Grocery.updateOne(
    { month: req.query.month },
    { $push: { list: req.body.list } }
  )
    .then(() => res.json("New Grocery item added"))
    .catch(() => res.json("Please check the error!!"));
});

// Update item of list by ID
router.put("/list/:id", async (req, res) => {
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
});

// delete item from list by ID
router.put("/remove-list/:id", async (req, res) => {
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
});

module.exports = router;
