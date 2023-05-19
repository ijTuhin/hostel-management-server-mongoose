const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model ("User", userSchema);
// GET
router.get('/', async(req, res) => {
    let query = {}
    if(req.body.sem){
        query = {sem: req.query.sem} //http://localhost:3000/user?sem={$sem}
    }
    else if(req.body.enroll){
        query = {enroll: req.query.enroll} //http://localhost:3000/user?enroll={$enroll}
    }
    else if( req.query.month && req.query.meal){
        query = {month: req.query.month, meal: req.query.mea} //http://localhost:3000/salary?month={$month}&meal={$meal}
    }
    else if( req.query.month && req.query.rent){
        query = {month: req.query.month, rent: req.query.mea} //http://localhost:3000/salary?month={$month}&rent={$rent}
    }
    await User.find(query) 
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
    
})


// PUT
router.put('/:id', async(req, res) => {
    await User.updateOne({_id: req.params.id}, {
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