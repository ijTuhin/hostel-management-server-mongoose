const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const paymentSchema = require("../collectionSchemas/paymentSchema.js")
const Payment = new mongoose.model("Payment", paymentSchema)

// POST new payment
router.post('/', async(req, res) => {
    const newPayment = new Payment(req.body);
    await newPayment
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

// GET by payment id
router.get('/:id', async(req, res) => {
    await Payment.find({_id: req.params.id})
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


// GET meal payment http://localhost:3000/payment?item=meal
// GET rent payment http://localhost:3000/payment?item=rent

router.get('/', async(req, res) => {
    let query = {};
    if(req.query.item){
        query = {
            item: req.query.item
        }
    }

    // else if(req.query.user && req.query.item) for user payment record
    await Payment.find(query)
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


// GET all
router.get('/', async(req, res) => {
    await Payment.find({})
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


// DELETE by ID
router.delete('/:id', async(req, res) => {
    await Payment.deleteOne({_id: req.params.id})
    .then(()=>{
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


// GET by user ID who made payment
router.get('/user', async(req, res) => {
    //
})

module.exports = router