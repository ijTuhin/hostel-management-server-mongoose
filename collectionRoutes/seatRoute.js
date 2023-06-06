const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const seatSchema = require("../collectionSchemas/seatSchema.js");
const Seat = new mongoose.model("Seat", seatSchema);
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);

// GET all room details
router.get("/", async (req, res) => {
  let query = {};
  if (req.query.vacancy) {
    query = { vacancy: req.query.vacancy }; //http://localhost:3001/seat?vacancy=${vacancy}
  }
  await Seat.find(query)
    .then((data) => res.json(data))
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});
router.get("/vacant", async (req, res) => {
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

// GET room details
router.get("/:id", async (req, res) => {
  await Seat.find({ _id: req.params.id })
    // .populate("member", "matric name dept sem")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

// Add new room
router.post("/", async (req, res) => {
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

// POST many
router.post("/all", async (req, res) => {
  await Seat.insertMany(req.body)
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

// Remove user from seat
router.put("/:room/remove/:matric", async (req, res) => {
  const vacant = await Seat.findOne({ room: req.params.room });
  let status = vacant.vacancy
  if(!status){
      status = true
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


// Allocate User Seat
router.put("/:matric/allocate/:room", async (req, res) => {
  const previous = req.body.previous;
  if (previous) {
    const prevVacant = await Seat.findOne({ room: previous });
    let prevStatus = prevVacant.vacancy
    if(!prevStatus){
        prevStatus = true
    }
    await Seat.updateOne(
      { room: previous },
      {
        $set: { vacant: prevVacant.vacant + 1, vacancy: prevStatus },
        $pull: {
          member: { $in: [req.params.matric] },
        },
      }
    );
  }
  const vacant = await Seat.findOne({ room: req.params.room });
  let status = true
  if(vacant.vacant === 1){
    status = false
  }
  await Seat.updateOne(
    { room: req.params.room },
    {
      $set: { vacant: vacant.vacant - 1, vacancy: status },
      $push: {
        member: req.params.matric,
      },
    }
  );
  await User.updateOne(
    { matric: req.params.matric },
    {
      $set: {
        room: req.params.room,
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

// DELETE room
router.delete("/:room", async (req, res) => {
  await Seat.deleteOne({ room: req.params.room })
    .then((data) => {
      res.status(200).json({
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
