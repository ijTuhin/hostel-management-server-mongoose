const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const SSLCommerzPayment = require("sslcommerz-lts");
const checkAdminLogin = require("../Authentications/checkAdminLogin.js");
const salarySchema = require("../collectionSchemas/salarySchema.js");
const Salary = new mongoose.model("Salary", salarySchema);
const staffSchema = require("../collectionSchemas/staffSchema.js");
const Staff = new mongoose.model("Staff", staffSchema);
const balanceSheetSchema = require("../collectionSchemas/balanceSheetSchema.js");
const BalanceSheet = new mongoose.model("BalanceSheet", balanceSheetSchema);

// GET salary record by query
// router.get("/", checkAdminLogin, async (req, res) => {
//   let query = {};
//   if (req.query.month) {
//     query = { month: req.query.month };
//   } else if (req.query.date) {
//     query = { date: req.query.date };
//   }
//   await Salary.find(query)
//     .populate("staff", "name position phone")
//     .sort({ _id: -1 })
//     .then((data) => {
//       res.json(data);
//     })
//     .catch(() => {
//       res.status(400).json({
//         error: "Oops! Something went wrong!",
//       });
//     });
// });

// GET salary record by Id from Admin section
router.get("/:id", checkAdminLogin, async (req, res) => {
  await Salary.find({ staff: req.params.id })
    .populate("staff", "name position phone")
    .sort({ _id: -1 })
    .then((data) => {
      console.log(data);
      res.status(200).json(data);
    })
    .catch(() => {
      res.status(400).json({
        error: "Oops! Something went wrong!",
      });
    });
});

// POST salary by staff ID from Admin section
router.post("/:id", checkAdminLogin, async (req, res) => {
  const store_id = process.env.SSL_STORE_ID;
  const store_passwd = process.env.SSL_STORE_PASS;
  const trxID = "Txr" + Math.random().toString(36).substring(4, 11) + "kdz";
  const is_live = false;
  const staffSalary = await Staff.findOne({ _id: req.params.id });
  const data = {
    total_amount: staffSalary.salary,
    currency: "BDT",
    tran_id: trxID, 
    success_url: `http://localhost:3001/salary/success/${trxID}`,
    fail_url: "http://localhost:3001/fail",
    cancel_url: "http://localhost:3001/cancel",
    ipn_url: "http://localhost:3001/ipn",
    shipping_method: "Payment",
    product_name: "Staff",
    product_category: "Salary",
    product_profile: staffSalary.position,
    cus_name: staffSalary.name,
    cus_email: "customer@example.com",
    cus_add1: staffSalary.address,
    cus_phone: staffSalary.phone,
    ship_name: staffSalary.name,
    ship_add1: staffSalary.address,
    ship_city: "Chattogram",
    ship_postcode: 4200,
    ship_country: "Bangladesh",
  };
  console.log(data);
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.init(data).then((apiResponse) => {
    let GatewayPageURL = apiResponse.GatewayPageURL;
    res.send({ url: GatewayPageURL });
    console.log("Redirecting to: ", GatewayPageURL);
  });

  router.post("/success/:trxId", async (req, res) => {
    const newSalary = await new Salary({
      salary: staffSalary.salary,
      staff: staffSalary._id,
      trxID: req.params.trxId,
    }).save();
    console.log(req.params.trxId, newSalary);
    if (newSalary) {
      await Staff.updateOne(
        { _id: staffSalary._id },
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
          console.log("Data insertion successful");
          res.redirect(`http://localhost:3000/salary/${req.params.id}`)
        })
        .catch(() => {
          console.log("Oops! Something went wrong!");
        });
    }
  });
});

// DELETE salary record by ID
// router.delete("/:id", checkAdminLogin, async (req, res) => {
//   await Salary.deleteOne({ _id: req.params.id })
//     .then(() => {
//       res.json({
//         result: "Data deletion successful",
//       });
//     })
//     .catch(() => {
//       res.status(400).json({
//         error: "Oops! Something went wrong!",
//       });
//     });
// });

module.exports = router;
