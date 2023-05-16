const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./collectionRoutes/userRoute.js")
const seatRoute = require("./collectionRoutes/seatRoute.js")
const app = express();
// const port = process.env.PORT || 5000;

app.use(cors()); // using middleware
app.use(express.json()); // to Body parse

require("dotenv").config(); // For storing DBname& password security

/* *******************
DB connection with Mongoose
******************** */
/* const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.12dph.mongodb.net/?retryWrites=true&w=majority`; */
mongoose
.connect('mongodb://localhost:27017/hostelManagement', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Successful Connection'))
.catch(err => console.log(err))

/* *******************
        Routes
******************** */
app.use('/user', userRoute)
app.use('/seat', seatRoute)

app.listen(3000, () => {
  console.log("Mongoose Server running");
});
