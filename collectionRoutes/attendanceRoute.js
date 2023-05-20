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
        res.status(200).json(data)
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})


// GET by Query 
router.get('/', async(req, res) => {
    let query = {}
    if(req.query.date){
        query = {date: req.query.date} // http://localhost:3001/attendance?date=${date}
    }
    await Attendance.find(query)
    .then((data)=>{
        res.status(200).json(data)
    })
    .catch(()=>{
        res.status(400).json({
            error: "Oops! Something went wrong!"
        })
    })
})

module.exports = router