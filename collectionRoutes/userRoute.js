const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const router = express.Router();
const checkAdminLogin = require("../Authentications/checkAdminLogin.js");
const checkLogin = require("../Authentications/checkLogin.js");
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);
const paymentSchema = require("../collectionSchemas/paymentSchema.js");
const Payment = new mongoose.model("Payment", paymentSchema);
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const month = months[new Date().getMonth()] + "-" + new Date().getFullYear();

// User SIGN-UP & LOG IN
router.post("/signup", checkAdminLogin, async (req, res) => {
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
            expiresIn: "10h",
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

// GET data
router.get("/", checkAdminLogin, async (req, res) => {
  await User.find({})
    .sort({ _id: -1 })
    .select("matric name enroll sem dept room email account")
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
router.get("/meal-status", checkAdminLogin, async (req, res) => {
  await User.find({})
    .sort({ meal: -1 })
    .select("matric name sem dept room meal")
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
router.get("/rent-status", checkAdminLogin, async (req, res) => {
  await User.find({})
    .sort({ rent: -1 })
    .select("matric name sem dept room rent")
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
router.get("/profile/:id", checkAdminLogin, checkLogin, async (req, res) => {
  await User.findOne({ _id: req.params.id })
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
router.get("/update", checkAdminLogin, async (req, res) => {
  await User.findOne({ matric: req.query.matric })
    .sort({ _id: -1 })
    .select({
      enroll: 0,
      meal: 0,
      rent: 0,
      email: 0,
      matric: 0,
      dept: 0,
      room: 0,
      coupon: 0,
      payments: 0,
      orders: 0,
      attendance: 0,
      __v: 0,
    })
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
router.get("/search", checkAdminLogin, async (req, res) => {
  await User.find({
    $or: [{ matric: req.query.matric }, { name: req.query.name }],
  })
    .sort({ _id: -1 })
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
router.get("/attendance", checkAdminLogin, async (req, res) => {
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

// UPDATE user data
router.put("/update/:id", checkAdminLogin, async (req, res) => {
  await User.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        password: req.body.password,
        current: req.body.current,
        sem: req.body.sem,
        phone: req.body.phone,
        district: req.body.district,
        address: req.body.address,
        thana: req.body.thana,
      },
    }
  )
    .then(() => res.json("Updated"))
    .catch(() => res.json("Could not Update"));
});
// UPDATE user rent status
router.put("/update-rent", checkLogin, async (req, res) => {
  const current = await Payment.findOne({
    month: month,
    item: "rent",
    user: req.userId,
  });
  if (!current)
    await User.updateOne(
      { _id: req.userId },
      {
        $set: {
          rent: 0,
        },
      }
    )
      .then(() => res.json("Updated Rent Status"))
      .catch(() => res.json("Could not Update"));
});
// UPDATE account validity
router.put("/account/:id", checkAdminLogin, async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (user.account)
    await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          account: false,
        },
      }
    )
      .then(() => res.json("Account invalidated"))
      .catch(() => res.json("Could not Update"));
  else
    await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          account: true,
        },
      }
    )
      .then(() => res.json("Account validated"))
      .catch(() => res.json("Could not Update"));
});

// DELETE user record
router.delete("/:id", checkAdminLogin, async (req, res) => {
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
