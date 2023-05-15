const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // using middleware
app.use(express.json()); // to Body parse

require("dotenv").config(); // For storing DBname& password security

/* *******************
DB connection with Mongoose
******************** */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.12dph.mongodb.net/?retryWrites=true&w=majority`;
mongoose
.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Successful Connection'))
.catch(err => console.log(err))



app.listen(port, () => {
  console.log("Mongoose Server running");
});
