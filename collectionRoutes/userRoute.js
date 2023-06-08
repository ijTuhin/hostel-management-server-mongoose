const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);
const seatSchema = require("../collectionSchemas/seatSchema.js");
const Seat = new mongoose.model("Seat", seatSchema);
// GET
router.get("/", async (req, res) => {
  let query = {};
  if (req.query.sem) {
    query = { sem: req.query.sem }; //http://localhost:3001/user?sem=${sem}
  } else if (req.query.enroll) {
    query = { enroll: req.query.enroll }; //http://localhost:3001/user?enroll=${enroll}
  } else if (req.query.meal) {
    query = { meal: req.query.meal }; //http://localhost:3001/user?meal=${meal}
  } else if (req.query.rent) {
    query = { rent: req.query.rent }; //http://localhost:3001/user?rent=${rent}
  }
  await User.find(query)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});
// GET
router.get("/search", async (req, res) => {
  await User.find({$or:[{ matric: req.query.matric }, { name: req.query.name }]})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

// GET all with academic data
router.get("/data", async (req, res) => {
  let query = {};
  await User.find(query)
    .select("matric name enroll sem dept room email")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

// GET all rent & meal status
router.get("/rent", async (req, res) => {
  let query = {};
  await User.find(query)
    .select("matric dept room rent")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});
router.get("/meal", async (req, res) => {
  let query = {};
  await User.find(query)
    .select("matric dept room meal coupon")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

// GET room by Id
router.get("/attendance", async (req, res) => {
  await User.find({})
    .populate("attendance", "date time")
    .select("matric dept attendance room")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});
// GET room by Id
router.get("/room/:id", async (req, res) => {
  await User.find({ _id: req.params.id })
    .populate("room", "room")
    .select("matric dept room sem")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

// GET user payment records by ID
router.get("/payments/:id", async (req, res) => {
  await User.find({ _id: req.params.id })
    .populate("payments")
    .select("matric dept room rent")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

// User SIGN-UP & LOG IN
router.post("/signup", async (req, res) => {
  const newUser = new User(req.body);
  await newUser
    .save()
    .then(() => {
      res.status(200).json({
        error: "Insertion successful",
      });
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});
router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });
    if (user && user.length > 0) {
      //   const isValid = await compare(user[0].password, req.body.password);
      if (user[0].password === req.body.password) {
        const token = jwt.sign(
          {
            email: user[0].email,
            userId: user[0]._id,
          },
          process.env.SECRET_JWT_TOKEN,
          {
            expiresIn: "1h",
          }
        );

        res.status(200).json({
          token: token,
          message: "Login Successful",
        });
      } else res.status(401).json("Authentication Failed");
    } else res.status(401).json("Authentication Failed");
  } catch {
    res.status(401).json("Authentication Failed");
  }
});

// POST many
router.post("/data-entry", async (req, res) => {
  await User.insertMany(req.body)
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

// UPDATE user room no. by Id
router.put("/update-room/:id", async (req, res) => {
  const vacant = req.body.vacant - 1;
  await User.updateOne(
    { _id: req.params.id },
    { $set: { room: req.body.room } }
  );
  await Seat.updateOne(
    { room: req.body.room },
    {
      $push: { member: req.params.id },
      $set: { vacant: vacant },
    }
  )
    .then(() => {
      res.status(200).json({
        result: "Room allocation successful",
      });
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Could not update seat!",
      });
    });
});

// DELETE
router.delete("/:id", async (req, res) => {
  await User.deleteOne({ _id: req.params.id })
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
