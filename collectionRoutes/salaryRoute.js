const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const salarySchema = require("../collectionSchemas/salarySchema.js");
const Salary = new mongoose.model ("Salary", salarySchema);
// GET
router.get('/', async(req, res) => {
    let query = {}
    if(req.query.month){
        query = {month: req.query.month} //http://localhost:3001/salary?month=${month}
    }
    else if(req.query.date){
        query = {date: req.query.date} //http://localhost:3001/salary?date=${date}
    }
    // else if(req.query.staff) for staff record
    await Salary.find(query) 
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
    await Salary.find({_id: req.params.id})
    .then((data)=>{
        res.status(200).json(data)
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})


// POST
router.post('/', async(req, res) => {
    const newSalary = new Salary(req.body);
    await newSalary
    .save()
    .then(()=>{
        res.status(200).json({
            error: "Insertion successful"
        })
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})

// POST many
router.post('/all', async(req, res) => {
    
})


// PUT
router.put('/:id', async(req, res) => {
    await Salary.updateOne({_id: req.params.id}, {
        $set: {
            address: req.body.address
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


// DELETE
router.delete('/:id', async(req, res) => {
    await Salary.deleteOne({_id: req.params.id})
    .then((data)=>{
        res.status(200).json({
            result: "Data deletion successful"
        })
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})

module.exports = router;