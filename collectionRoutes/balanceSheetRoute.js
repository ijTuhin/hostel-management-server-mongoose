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

// GET all data from Balance Sheet and UPDATE debit-credit
router.get("/", async(req, res) => {
    let query = {month: req.query.month}
    let credit = 0
    let debit = 0
    let salary = 0
    let meal = 0
    let rent = 0
    let grocery = 0
    let utility = 0
    let utilities = [];

    await BalanceSheet.findOne(query)
    .populate("mealBill", "bill")
    .populate("seatRent", "bill")
    .populate("salary", "salary")
    .populate("utility", "name bill")
    .populate("grocery", "total")
    .then((data)=> {
        data.mealBill.map(i=>{ meal = meal + i.bill});
        data.seatRent.map(i=>{ rent = rent + i.bill});
        data.salary.map(i=>{ salary = salary + i.salary});
        data.grocery.map(i=>{ grocery = grocery + i.total});
        data.utility.map(i=>{ 
            utilities.push({
                name: i.name,
                bill: i.bill
            });
            utility = utility + i.bill});
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
            debit: debit
        })
    })
    .catch(()=> res.json("Error!!"));
    await BalanceSheet.updateOne(query, {$set: {credit:credit, debit:debit}})
})

module.exports = router