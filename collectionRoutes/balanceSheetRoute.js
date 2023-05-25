const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const balanceSheetSchema = require("../collectionSchemas/balanceSheetSchema")
const BalanceSheet = new mongoose.model("BalanceSheet", balanceSheetSchema)
const paymentSchema = require("../collectionSchemas/paymentSchema.js");
const Payment = new mongoose.model("Payment", paymentSchema);
const utilitySchema = require("../collectionSchemas/utilitySchema")
const Utility = new mongoose.model("Utility", utilitySchema)
const salarySchema = require("../collectionSchemas/salarySchema.js");
const Salary = new mongoose.model ("Salary", salarySchema);
const grocerySchema = require("../collectionSchemas/grocerySchema");
const Grocery = new mongoose.model("Grocery", grocerySchema);

router.get("/", async(req, res) => {
    let salary = 0
    await Salary.find({month: req.query.month}).select("salary")
    .then((data)=>{data.map(i => salary = salary + i.salary)}); 
    console.log(salary)

    /* await Payment.find({month: req.query.month}).select("salary")
    .then((data)=>{data.map(i => salary = salary + i.salary)}); 
    console.log(salary) */

})


module.exports = router