const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./collectionRoutes/userRoute.js")
const seatRoute = require("./collectionRoutes/seatRoute.js")
const paymentRoute = require("./collectionRoutes/paymentRoute.js")
const mealRoute = require("./collectionRoutes/mealRoute.js")
const attendanceRoute = require("./collectionRoutes/attendanceRoute.js")
const utilityRoute = require("./collectionRoutes/utilityRoute.js")
const staffRoute = require("./collectionRoutes/staffRoute.js")
const salaryRoute = require("./collectionRoutes/salaryRoute.js")
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
app.use('/payment', paymentRoute)
app.use('/meal', mealRoute)
app.use('/attendance', attendanceRoute)
app.use('/utility', utilityRoute)
app.use('/staff', staffRoute)
app.use('/salary', salaryRoute)

app.listen(3001, () => {
  console.log("Mongoose Server running");
});
