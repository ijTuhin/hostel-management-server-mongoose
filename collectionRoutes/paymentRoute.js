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

module.exports = router