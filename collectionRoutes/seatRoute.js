const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const seatSchema = require("../collectionSchemas/seatSchema.js");
const Seat = new mongoose.model ("Seat", seatSchema);
// GET
router.get('/', async(req, res) => {
    await Seat.find({})
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
    /* await Seat.find({_id: req.params.id})
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


// POST
router.post('/', async(req, res) => {
    const newSeat = new Seat(req.body);
    await newSeat
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

// POST many
router.post('/all', async(req, res) => {
    await Seat.insertMany(req.body)
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


// Remove user to seat
router.put('/:room/remove-user', async(req, res) => {
    await Seat.updateOne({room: req.params.room}, {
        $pull: {
            member: { $in: [ req.body.member ] }
        }
    }
    )
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
router.put('/:room/add-vacancy', async(req, res) => {
    const vacant = req.body.vacant + 1;
    await Seat.updateOne({room: req.params.room}, {
        $set: {
            vacant: vacant
        }
    }
    )
    .then(()=>{
        res.status(200).json({
            result: "Data update successful"
        })
    })
    .catch((err)=>{
        res.status(400).json({
            message: err,
            error: "Oops! Something went wrong!"
        })
    })
})
// Add user to seat
router.put('/:room/insert-user', async(req, res) => {
    await Seat.updateOne({room: req.params.room}, {
        $push: {
            member: req.body.member
        }
    }
    )
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
router.put('/:room/remove-vacancy', async(req, res) => {
    const vacant = req.body.vacant - 1;
    await Seat.updateOne({room: req.params.room}, {
        $set: {
            vacant: vacant
        }
    }
    )
    .then(()=>{
        res.status(200).json({
            result: "Data update successful"
        })
    })
    .catch((err)=>{
        res.status(400).json({
            message: err,
            error: "Oops! Something went wrong!"
        })
    })
})


// DELETE
router.delete('/:id', async(req, res) => {
    /* await Seat.deleteOne({_id: req.params.id})
    .then((data)=>{
        res.status(200).json({
            result: "Data deletion successful"
        })
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    }) */
})

module.exports = router;