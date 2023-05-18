const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const attendanceSchema = require("../collectionSchemas/attendanceSchema")
const Attendance = new mongoose.model("Attendance", attendanceSchema)


// POST new attendance
router.post('/', async(req, res) => {
    const newAttendance = new Attendance(req.body);
    await newAttendance
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


// DELETE Attendance request by ID
router.delete('/:id', async(req, res) => {
    await Attendance.deleteOne({_id: req.params.id})
    .then(()=>{
        res.status(201).json({
            result: "Data deletion successful"
        })
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})


// GET by id
router.get('/:id', async(req, res) => {
    await Attendance.find({_id: req.params.id})
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


// GET by Date http://localhost:3000/date?date={$date}
router.get('/', async(req, res) => {
    await Attendance.find({date: req.query.date})
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
/* router.get('/', async(req, res) => {
    await Attendance.find({})
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
}) */





module.exports = router