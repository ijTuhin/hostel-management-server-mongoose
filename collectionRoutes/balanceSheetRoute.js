const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkAdminLogin = require("../Authentications/checkAdminLogin.js");
const balanceSheetSchema = require("../collectionSchemas/balanceSheetSchema")
const BalanceSheet = new mongoose.model("BalanceSheet", balanceSheetSchema)

// GET all data from Balance Sheet and UPDATE debit-credit
router.get("/", checkAdminLogin, async(req, res) => {
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