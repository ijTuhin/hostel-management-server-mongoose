const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const seatSchema = require("../collectionSchemas/seatSchema.js");
const Seat = new mongoose.model ("Seat", seatSchema);
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model ("User", userSchema);

// GET all room details
router.get('/', async(req, res) => {
    let query = {}
    if(req.query.vacancy){
        query = {vacancy: req.query.vacancy} //http://localhost:3001/seat?vacancy=${vacancy}
    }
    await Seat.find(query)
    .populate("member", "matric name dept sem")
    .then((data)=>{
        res.status(200).json(data)
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})


// GET room details
router.get('/:id', async(req, res) => {
    await Seat.find({_id: req.params.id})
    .populate("member", "matric name dept sem")
    .then((data)=>{
        res.status(200).json(data)
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})


// GET room number by member id
/* router.get('/:member', async(req, res) => {
    await Seat.find({member: { $in: [ req.params.member ] } })
    .select({
        member: 0,
        vacant: 0,
        vacancy: 0,
        __v: 0
    }) // To get all data, remove the select
    .then((data)=>{
        res.status(200).json(data)
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
}) */


// Add new room
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


// Remove user from seat
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
    const vacant = await Seat.findOne({room: req.params.room})
    await Seat.updateOne({room: req.params.room}, {
        $set:{vacant: vacant.vacant - 1},
        $push: {
            member: req.body.member
        }
    }
    );
    await User.updateOne({matric: req.body.member},
        {
            $set:{
                room: req.params.room
            }
        })
    .then(()=>res.json("Data update successful"))
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


// DELETE room
router.delete('/:room', async(req, res) => {
    await Seat.deleteOne({room: req.params.room})
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