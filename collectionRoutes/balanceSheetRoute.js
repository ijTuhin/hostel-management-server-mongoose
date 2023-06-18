const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkAdminLogin = require("../Authentications/checkAdminLogin.js");
const balanceSheetSchema = require("../collectionSchemas/balanceSheetSchema");
const BalanceSheet = new mongoose.model("BalanceSheet", balanceSheetSchema);
const paymentSchema = require("../collectionSchemas/paymentSchema.js");
const Payment = new mongoose.model("Payment", paymentSchema);
const salarySchema = require("../collectionSchemas/salarySchema.js");
const Salary = new mongoose.model("Salary", salarySchema);
const staffSchema = require("../collectionSchemas/staffSchema.js");
const Staff = new mongoose.model("Staff", staffSchema);
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);
const adminSchema = require("../collectionSchemas/adminSchema.js");
const Admin = new mongoose.model("Admin", adminSchema);
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const month = months[new Date().getMonth()] + '-' + new Date().getFullYear();
// GET all data from Balance Sheet and UPDATE debit-credit
router.get("/", checkAdminLogin, async (req, res) => {
  let query = { month: req.query.month };
  let credit = 0;
  let debit = 0;
  let salary = 0;
  let meal = 0;
  let rent = 0;
  let grocery = 0;
  let utility = 0;
  let utilities = [];

  await BalanceSheet.findOne(query)
    .populate("mealBill", "bill")
    .populate("seatRent", "bill")
    .populate("salary", "salary")
    .populate("utility", "name bill")
    .populate("grocery", "total")
    .then((data) => {
      data.mealBill.map((i) => {
        meal = meal + i.bill;
      });
      data.seatRent.map((i) => {
        rent = rent + i.bill;
      });
      data.salary.map((i) => {
        salary = salary + i.salary;
      });
      data.grocery.map((i) => {
        grocery = grocery + i.total;
      });
      data.utility.map((i) => {
        utilities.push({
          name: i.name,
          bill: i.bill,
        });
        utility = utility + i.bill;
      });
      credit = meal + rent;
      debit = salary + grocery + utility;
      res.json({
        mealBill: meal,
        seatRent: rent,
        salary: salary,
        grocery: grocery,
        utilities: utilities,
        utility: utility,
        credit: credit,
        debit: debit,
      });
    })
    .catch(() => res.json("Error!!"));
  await BalanceSheet.updateOne(query, {
    $set: { credit: credit, debit: debit },
  });
});

// GET Finance
router.get("/finances", checkAdminLogin, async (req, res) => {
  const admin = await Admin.findOne({ _id: req.adminId }).select("role");
  const user = await User.estimatedDocumentCount();
  const staff = await Staff.estimatedDocumentCount();
  const meal = await User.find({ meal: 0 }).select("meal");
  const rent = await User.find({ rent: 0 }).select("rent");
  const salary = await Salary.find({ month: month }).select("salary");
  if (admin.role === "accountant") {
    res.json({
      meal: (meal.length * 100) / user,
      rent: (rent.length * 100) / user,
      salary: (salary.length * 100) / staff,
    });
  }
});

module.exports = router;
