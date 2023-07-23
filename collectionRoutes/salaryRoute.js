const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkAdminLogin = require("../Authentications/checkAdminLogin.js");
const salarySchema = require("../collectionSchemas/salarySchema.js");
const Salary = new mongoose.model("Salary", salarySchema);
const staffSchema = require("../collectionSchemas/staffSchema.js");
const Staff = new mongoose.model("Staff", staffSchema);
const balanceSheetSchema = require("../collectionSchemas/balanceSheetSchema.js");
const BalanceSheet = new mongoose.model("BalanceSheet", balanceSheetSchema);

// GET salary record by query
router.get("/", checkAdminLogin, async (req, res) => {
  let query = {};
  if (req.query.month) {
    query = { month: req.query.month };
  } else if (req.query.date) {
    query = { date: req.query.date };
  }
  await Salary.find(query)
    .populate("staff", "name position phone")
    .sort({ _id: -1 })
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

// GET salary record by Id
router.get("/:id", checkAdminLogin, async (req, res) => {
  await Salary.find({ staff: req.params.id })
    .populate("staff", "name position phone")
    .sort({ _id: -1 })
    .then((data) => {
      console.log(data)
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

// POST salary by staff ID
router.post("/:id", checkAdminLogin, async (req, res) => {
  const staffSalary = await Staff.findOne({ _id: req.params.id }).select(
    "salary"
  );
  const newSalary = await new Salary({
    salary: staffSalary.salary,
    staff: req.params.id,
  }).save();
  await Staff.updateOne(
    { _id: req.params.id },
    {
      $push: {
        record: newSalary._id,
      },
    }
  );
  await BalanceSheet.updateOne(
    { status: 1 },
    {
      $push: { salary: newSalary._id },
    }
  )
    .then(() => {
      res.json("Data insertion successful");
    })
    .catch(() => {
      res.json("Oops! Something went wrong!");
    });
});

// DELETE salary record by ID
router.delete("/:id", checkAdminLogin, async (req, res) => {
  await Salary.deleteOne({ _id: req.params.id })
    .then(() => {
      res.json({
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
