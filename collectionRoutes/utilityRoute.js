const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const utilitySchema = require("../collectionSchemas/utilitySchema")
const Utility = new mongoose.model("Utility", utilitySchema)


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


module.exports = router;
/* 
============== To store Due to new from previous unpaid utility bill ===============
const value = [
    {status: 0,bill: 2000, name: "item1"},
    {status: 0,bill: 1200, name: "item2"},
    {status: 1,bill: 2500, name: "item3"},
    {status: 0,bill: 3000, name: "item4"},
    {status: 1,bill: 4500, name: "item5"}
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