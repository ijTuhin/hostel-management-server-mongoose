const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const grocerySchema = require("../collectionSchemas/grocerySchema")
const Grocery = new mongoose.model("Grocery", grocerySchema)

router.post('/', async(req, res)=>{
    const newGrocery = new Grocery(req.body)
    await newGrocery.save()
    .then(()=>res.json("New Grocery Bucket created"))
    .catch(()=>res.json("Please check the error!!"))
})

module.exports = router