const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const seatSchema = require("../collectionSchemas/seatSchema.js");
const Seat = new mongoose.model ("Seat", seatSchema);
// GET
router.get('/', async(req, res) => {

})

// GET by Id
router.get('/:id', async(req, res) => {

})


// POST
router.post('/', async(req, res) => {

})

// POST many
router.post('/all', async(req, res) => {
    
})


// PUT
router.put('/:id', async(req, res) => {

})


// DELETE
router.delete('/:id', async(req, res) => {

})

module.exports = router;