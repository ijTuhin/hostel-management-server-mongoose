const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkAdminLogin = require("../Authentications/checkAdminLogin.js");
const staffSchema = require("../collectionSchemas/staffSchema.js");
const Staff = new mongoose.model("Staff", staffSchema);
const salarySchema = require("../collectionSchemas/salarySchema.js");
const Salary = new mongoose.model("Salary", salarySchema);
// GET all staff data from Admin section
router.get("/", checkAdminLogin, async (req, res) => {
  let query = {};
  if (req.query.joining) {
    query = { joining: req.query.joining };
  } else if (req.query.position) {
    query = { position: req.query.position };
  } else if (req.query.joining && req.query.position) {
    query = {
      joining: req.query.joining,
      position: req.query.position,
    };
  }
  await Staff.find(query)
    .sort({ _id: -1 })
    .populate("record", "date month")
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.json("Oops! Something went wrong!");
    });
});

// GET staff data by Id from Admin section
router.get("/:id", async (req, res) => {
  await Staff.findOne({ _id: req.params.id })
    .populate("record", "date")
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.json("Oops! Something went wrong!");
    });
});

// POST new staff record from Admin section
router.post("/", checkAdminLogin, async (req, res) => {
  const newStaff = new Staff(req.body);
  await newStaff
    .save()
    .then(() => {
      res.json("Data insertion successful");
    })
    .catch(() => {
      res.json("Oops! Something went wrong!");
    });
});

// UPDATE staff data from Admin section
router.put("/:id", checkAdminLogin, async (req, res) => {
  await Staff.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        salary: req.body.salary,
        position: req.body.position,
        phone: req.body.phone,
      },
    }
  )
    .then(() => {
      res.json("Data update successful");
    })
    .catch(() => {
      res.json("Oops! Something went wrong!");
    });
});

// DELETE staff record by ID from Admin section
router.delete("/:id", checkAdminLogin, async (req, res) => {
  await Staff.deleteOne({ _id: req.params.id })
    .then(() => {
      res.json("Data deletion successful");
    })
    .catch(() => {
      res.json("Oops! Something went wrong!");
    });
});

module.exports = router;
