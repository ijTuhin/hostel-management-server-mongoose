const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const mealSchema = require("../collectionSchemas/mealSchema")
const Meal = new mongoose.model("Meal", mealSchema)

// POST new meal order
router.post('/order', async(req, res) => {
    const newMeal = new Meal(req.body);
    await newMeal
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


// GET by id
router.get('/:id', async(req, res) => {
    await Meal.find({_id: req.params.id})
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
    await Meal.find({})
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

// GET by status AND meal AND date
router.get('/', async(req, res) => {
    
})


/* ==============================================
    Need to solve the url issue,
    below operationscan't be done as we have
    already used '/' url for getting all data
============================================== */

// GET by Meal name http://localhost:3000/meal?meal=Breakfast
/* router.get('/', async(req, res) => {
    await Meal.find({meal: req.query.meal})
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

// GET by Date http://localhost:3000/date?date=Breakfast
/* router.get('/', async(req, res) => {
    await Meal.find({date: req.query.date})
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




module.exports = router;