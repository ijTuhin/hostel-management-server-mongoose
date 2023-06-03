const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const utilitySchema = require("../collectionSchemas/utilitySchema")
const Utility = new mongoose.model("Utility", utilitySchema)
const balanceSheetSchema = require("../collectionSchemas/balanceSheetSchema.js");
const BalanceSheet = new mongoose.model ("BalanceSheet", balanceSheetSchema);


// GET by month http://localhost:3001/utility?month=${month}
router.get('/', async(req, res) => {
    let query = {}
    if(req.query.month){
        query = {month:req.query.month} // http://localhost:3001/utility?month=${month}
    }
    else if(req.query.name){
        query = {name:req.query.name} // http://localhost:3001/utility?name=${name}
    }
    await Utility.find(query) 
    .then((data)=>{
        res.status(200).json(data)
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})


// GET by Id
router.get('/:id', async(req, res) => {
    await Utility.find({_id: req.params.id})
    .then((data)=>{
        res.status(200).json(data)
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})


// POST new Utility
router.post('/', async(req, res) => {
    const newUtility = new Utility(req.body);
    await newUtility
    .save()
    .then(()=>{
        res.status(200).json({
            success: "Insertion successful"
        })
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})
router.post('/new', async(req, res) => {
    await Utility.insertMany(req.body)
    .then((data)=>{
        res.status(200).json({
            data
        })
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})


// UPDATE utility bill & status
router.put('/insert-bill/:id', async(req, res) => { // From Warden Panel
    await Utility.updateOne({_id: req.params.id, status: 1}, {
        $set: {
            bill: req.body.bill
        }
    })
    .then(()=>{
        res.status(200).json({
            result: "Data update successful"
        })
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})
router.put('/pay-bill/:id', async(req, res) => { // From Finance Panel
    await Utility.updateOne({_id: req.params.id, status: 1}, {
        $set: {status: 0}
    });
    await BalanceSheet.updateOne(
        { status: 1 },
        {$push: {utility: req.params.id,}}
    )
    .then(()=>{
        res.status(200).json({
            result: "Bill Paid"
        })
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})


module.exports = router;
/* 
============== To store Due to new from previous unpaid utility bill ===============
const value = [
    {status: 0,bill: 2000, name: "item1"},
    {status: 0,bill: 1200, name: "item2"},
  ]
  const item = value.map(i => {
    const items = {
      due:i.status * i.bill,
      name: i.name
    }
    console.log(i.status * i.bill)
    return items;
  })
*/