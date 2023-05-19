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


// UPDATE status by Id
router.put('/:id', async(req, res) => {
    await Meal.updateOne({_id: req.params.id}, {
        $set: {
            status: req.body.status
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


// DELETE meal request by ID
router.delete('/:id', async(req, res) => {
    await Meal.deleteOne({_id: req.params.id, status: 0}) // deletes data according to condition but not showing error while condition not fulfiled
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
    let query = {};
    if(req.query.date && req.query.meal && req.query.status){
        query = {meal: req.query.meal, date: req.query.date, status: req.query.status} //http://localhost:3000/meal?meal={$meal}&date={$date}&status={$status}
    }
    else if(req.query.meal){
        query = {meal: req.query.meal} //http://localhost:3000/meal?meal={$meal}
    }
    else if(req.query.date){
        query = {date: req.query.date} //http://localhost:3000/meal?date={$date}
    }
    await Meal.find(query)
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

module.exports = router;