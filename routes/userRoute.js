const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const userSchema = require("./userSchema.js");
const User = new mongoose.model ("User", userSchema);
// GET
router.get('/', async(req, res) => {
    // To get data using query
    await User.find({status: 'inactive',title: "Learn CSS Grid"}) //find({}) for all
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
    // To get data without some _id & title field with certain limit
    /* await User.find({status: 'inactive',title: "Learn CSS Grid"})
    .select({
        _id: 0,
        title: 0,
        __v: 0
    })
    .limit(2)
    .then((data)=>{
        res.status(200).json({
            data: data
        })
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    }) */
})

// GET by Id
router.get('/:id', async(req, res) => {
    await User.find({_id: req.params.id})
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
    const newUser = new User(req.body);
    await newUser
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
    await User.insertMany(req.body)
    .then(()=>{
        res.status(200).json({
            result: "All Data Insertion successful"
        })
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})


// PUT
router.put('/:id', async(req, res) => {
    await User.updateOne({_id: req.params.id}, {
        $set: {
            status: 'inactive'
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
    await User.deleteOne({_id: req.params.id})
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