const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkAdminLogin = require("../Authentications/checkAdminLogin.js");
const seatSchema = require("../collectionSchemas/seatSchema.js");
const Seat = new mongoose.model("Seat", seatSchema);
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);

// GET all room details from Admin section
router.get("/", checkAdminLogin, async (req, res) => {
  let query = {};
  if (req.query.vacancy) {
    query = { vacancy: req.query.vacancy };
  }
  await Seat.find(query)
  .populate("member", "matric name dept sem phone")
    // .sort({ _id: -1 })
    .then((data) => res.json(data))
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});
// GET vacant seats from Admin section
router.get("/vacant", checkAdminLogin, async (req, res) => {
  await Seat.find({ vacancy: true })
    .sort({ vacant: 1 })
    .select("room vacant")
    .then((data) => res.json(data))
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});


// Add new room
router.post("/", checkAdminLogin, async (req, res) => {
  const newSeat = new Seat(req.body);
  await newSeat
    .save()
    .then(() => {
      res.status(200).json({
        success: "Insertion successful",
      });
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});


// Remove user from seat from Admin section
router.put("/:room/remove/:matric", checkAdminLogin, async (req, res) => {
  const vacant = await Seat.findOne({ room: req.params.room });
  let status = vacant.vacancy;
  if (!status) {
    status = true;
  }
  await Seat.updateOne(
    { room: req.params.room },
    {
      $set: { vacant: vacant.vacant + 1, vacancy: status },
      $pull: {
        member: { $in: [req.params.matric] },
      },
    }
  );
  await User.updateOne(
    { matric: req.params.matric },
    {
      $set: { room: 0 },
    }
  )
    .then(() => {
      res.status(200).json({
        result: `${req.params.matric} removed from Room ${req.params.room}`,
      });
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

// Allocate User Seat from Admin section
router.put("/:matric/allocate/:room", checkAdminLogin, async (req, res) => {
  const previous = req.body.previous;
  if (previous) {
    const prevVacant = await Seat.findOne({ room: previous.room });
    let prevStatus = prevVacant.vacancy;
    if (!prevStatus) {
      prevStatus = true;
    }
    await Seat.updateOne(
      { room: previous.room },
      {
        $set: { vacant: prevVacant.vacant + 1, vacancy: prevStatus },
        $pull: {
          member: { $in: [req.params.matric] },
        },
      }
    );
  }
  const vacant = await Seat.findOne({ room: req.params.room });
  let status = true;
  if (vacant.vacant === 1) {
    status = false;
  }
  await Seat.updateOne(
    { room: req.params.room },
    {
      $set: { vacant: vacant.vacant - 1, vacancy: status },
      $push: {
        member: req.params.matric,
      },
      // $push: {
      //   edit: {
      //     $each: [{ member: req.params.matric }],
      //     $sort: -1,
      //   },
      // },
    }
  );
  await User.updateOne(
    { _id: req.params.matric },
    {
      $set: {
        room: vacant._id,
      },
    }
  )
    .then(() => {
      if (previous)
        res.json(
          `${req.params.matric} removed from Room ${previous} and added to ${req.params.room}`
        );
      else
        res.json(`${req.params.matric} removed from Room ${req.params.room}`);
    })
    .catch(() => {
      res.json({
        error: "Oops! Something went wrong!",
      });
    });
});

module.exports = router;
