const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);
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

// GET by rent & meal status
router.get("/data", async (req, res) => {
  let query = {};
  await User.find(query)
    .select("matric name enroll sem dept room")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});
// GET by rent & meal status
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
    .select("matric dept room meal")
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
  await User.find({ _id: req.params.id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

// POST
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
          access_token: token,
          message: "Login Successful",
        });
      }
      else res.status(401).json("Authentication Failed");
    }
    else res.status(401).json("Authentication Failed");
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

// PUT
router.put("/:id", async (req, res) => {
  await User.updateOne(
    { _id: req.params.id },
    {
      $set: {
        address: req.body.address,
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
