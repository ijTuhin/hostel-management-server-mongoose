const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./collectionRoutes/userRoute.js");
const seatRoute = require("./collectionRoutes/seatRoute.js");
const paymentRoute = require("./collectionRoutes/paymentRoute.js");
const mealRoute = require("./collectionRoutes/mealRoute.js");
const attendanceRoute = require("./collectionRoutes/attendanceRoute.js");
const utilityRoute = require("./collectionRoutes/utilityRoute.js");
const staffRoute = require("./collectionRoutes/staffRoute.js");
const salaryRoute = require("./collectionRoutes/salaryRoute.js");
const groceryRoute = require("./collectionRoutes/groceryRoute.js");
const balanceSheetRoute = require("./collectionRoutes/balanceSheetRoute.js");
const packageRoute = require("./collectionRoutes/packageRoute.js");
const adminRoute = require("./collectionRoutes/adminRoute.js");
const noticeRoute = require("./collectionRoutes/noticeRoute.js");
const app = express();

app.use(cors()); // using middleware
app.use(express.json()); // to Body parse

require("dotenv").config(); 

/* *******************
DB connection with Mongoose
******************** */
const database = (module.exports = () => {
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@dbhost.ueaoans.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("Successful Connection"))
    .catch((err) => console.log(err));
});

database()

/* *******************
        Routes
******************** */
app.use("/user", userRoute);
app.use("/seat", seatRoute);
app.use("/payment", paymentRoute);
app.use("/meal", mealRoute);
app.use("/attendance", attendanceRoute);
app.use("/utility", utilityRoute);
app.use("/staff", staffRoute);
app.use("/salary", salaryRoute);
app.use("/grocery", groceryRoute);
app.use("/balanceSheet", balanceSheetRoute);
app.use("/package", packageRoute);
app.use("/admin", adminRoute);
app.use("/notice", noticeRoute);

app.listen(3001, () => {
  console.log("Mongoose Server running");
});
