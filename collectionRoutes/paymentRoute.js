const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const paymentSchema = require("../collectionSchemas/paymentSchema.js")
const checkLogin = require("../Authentications/checkLogin.js")
const Payment = new mongoose.model("Payment", paymentSchema)

// POST new payment
router.post('/', checkLogin, async(req, res) => {
    const newPayment = new Payment({
        ...req.body,
        user: req.userId
    });
    console.log(newPayment)
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
router.get('/:id', checkLogin, async(req, res) => {
    await Payment.find({_id: req.params.id})
    .then((data)=>{
        res.status(200).json(data)
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})


// GET meal payment http://localhost:3001/payment?item=meal
// GET rent payment http://localhost:3001/payment?item=rent

router.get('/', checkLogin, async(req, res) => {
    let query = {};
    if(req.query.month && req.query.item){
        query = {
            item: req.query.item,
            month: req.query.month
        }
    }
    else if(req.query.item){
        query = {
            item: req.query.item
        }
    }
    await Payment.find(query)
    .populate("user", "matric dept room")
    .then((data)=>{
        res.status(200).json(data)
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})


// GET all
router.get('/', checkLogin, async(req, res) => {
    console.log("Email: ", req.email)
    await Payment.find({})
    .then((data)=>{
        res.status(200).json(data)
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})


// DELETE by ID
router.delete('/:id', checkLogin, async(req, res) => {
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
router.get('/user', checkLogin, async(req, res) => {
    //
})

module.exports = router