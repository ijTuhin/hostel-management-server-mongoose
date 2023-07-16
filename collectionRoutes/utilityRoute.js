const express = require("express");
const mongoose = require("mongoose");
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

// GET by month http://localhost:3001/utility?month=${month}
router.get("/", async (req, res) => {
  let query = {};
  if (req.query.month) {
    query = { month: req.query.month }; // http://localhost:3001/utility?month=${month}
  } else if (req.query.name) {
    query = { name: req.query.name }; // http://localhost:3001/utility?name=${name}
  }
  await Utility.find(query)
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
    { _id: req.params.id, status: 1 },
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
  const data = await Utility.findOne({ _id: req.params.id }).select("due");
  if (data.due.bill > 0) {
    await Utility.updateOne(
      { _id: data.due.id, status: 1 },
      {
        $set: { status: 0, date: date },
      }
    );
  }
  await Utility.updateOne(
    { _id: req.params.id, status: 1 },
    {
      $set: { status: 0, date: date },
    }
  );
  await BalanceSheet.updateOne(
    { status: 1 },
    {
      $push: { utility: req.params.id }
    }
  )
    .then(() => {
      res.status(200).json({
        result: "Bill Paid",
      });
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

module.exports = router;
