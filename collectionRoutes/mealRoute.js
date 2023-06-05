const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkLogin = require("../Authentications/checkLogin.js");
const mealSchema = require("../collectionSchemas/mealSchema")
const Meal = new mongoose.model("Meal", mealSchema);
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);

// POST new meal order
router.post('/', checkLogin, async(req, res) => {
    const user = await User.findOne({_id: req.userId})
    if( user.coupon > 0 && user.meal ){
        const newMeal = await new Meal({
            ...req.body,
            user: req.userId,
          }).save()
        if(user.coupon === 1){
            await User.updateOne(
                {_id: req.userId},
                {
                    $push:{orders: newMeal._id},
                    $set: {
                        coupon: user.coupon - 1,
                        meal: 0
                    }
                }
            )
            .then(()=> res.json("Insertion successful"))
            .catch(()=> res.json("Oops! Something went wrong!"))
        }
        else{
            await User.updateOne(
                {_id: req.userId},
                {
                    $push:{orders: newMeal._id},
                    $set: {
                        coupon: user.coupon - 1
                    }
                }
            )
            .then(()=> res.json("Insertion successful"))
            .catch(()=> res.json("Oops! Something went wrong!"))
        }
    }
    else {res.json("Please pay your meal bill. Thank You")}
})


// UPDATE received status by Id
router.put('/:id', checkLogin, async(req, res) => {
    await Meal.updateOne({_id: req.params.id}, {
        $set: {status: 1}
    })
    .then(()=> res.json("Insertion successful"))
    .catch(()=> res.json("Oops! Something went wrong!"))
})


// DELETE meal request by ID
router.delete('/:id', checkLogin, async(req, res) => {
    const meal = await Meal.findOne({_id: req.params.id})
    if(!meal.status){
        const user = await User.findOne({_id: req.userId})
        await Meal.deleteOne({_id: req.params.id, status: 0})
        .then(async ()=> {
            await User.updateOne(
                {_id: req.userId},
                {$set: {coupon: user.coupon + 1}}
            )
            .then(() => res.json("Deleted"))
        })
        .catch(()=> res.json("Oops! Something went wrong!"))
    }
    else {res.json("Meal Served!")}
})


// GET by id
router.get('/:id', checkLogin, async(req, res) => {
    await Meal.find({_id: req.params.id})
    .populate("user", "matric dept room name")
    .then((data)=> res.json(data))
    .catch(()=> res.json("Oops! Something went wrong!"))
})

// GET all
router.get('/', checkLogin, async(req, res) => {
    let query = {};
    if(req.query.date && req.query.meal && req.query.status){
        query = {meal: req.query.meal, date: req.query.date, status: req.query.status} //http://localhost:3001/meal?meal=${meal}&date=${date}&status=${status}
    }
    else if(req.query.meal){
        query = {meal: req.query.meal} //http://localhost:3001/meal?meal=${meal}
    }
    else if(req.query.date){
        query = {date: req.query.date} //http://localhost:3001/meal?date=${date}
    }
    await Meal.find(query)
    .populate("user", "matric dept room name")
    .then((data)=> res.json(data))
    .catch(()=> res.json("Oops! Something went wrong!"))
})

module.exports = router;