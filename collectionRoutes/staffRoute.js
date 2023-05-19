const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const staffSchema = require("../collectionSchemas/staffSchema.js");
const Staff = new mongoose.model ("Staff", staffSchema);
// GET
router.get('/', async(req, res) => {
    let query = {}
    if(req.query.joining){
        query = {joining: req.query.joining} //http://localhost:3000/staff?joining={$joining}
    }

    await Staff.find({}) 
    .then((data)=>{
        res.status(200).json({
            data: data
        })
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})

// GET by Id
router.get('/:id', async(req, res) => {
    await Staff.find({_id: req.params.id})
    .then((data)=>{
        res.status(200).json({
            data: data
        })
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})


// POST
router.post('/', async(req, res) => {
    const newStaff = new Staff(req.body);
    await newStaff
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
    await Staff.updateOne({_id: req.params.id}, {
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
    await Staff.deleteOne({_id: req.params.id})
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