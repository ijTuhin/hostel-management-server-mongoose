const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const checkLogin = require("../Authentications/checkLogin.js");
const packageSchema = require("../collectionSchemas/packageSchema")
const Package = new mongoose.model("Package", packageSchema);
const paymentSchema = require("../collectionSchemas/paymentSchema")
const Payment = new mongoose.model("Payment", paymentSchema);
const userSchema = require("../collectionSchemas/userSchema.js");
const User = new mongoose.model("User", userSchema);
const balanceSheetSchema = require("../collectionSchemas/balanceSheetSchema.js");
const BalanceSheet = new mongoose.model ("BalanceSheet", balanceSheetSchema);

router.post('/meal', checkLogin, async(req, res)=>{
    const checkPackage = await Package.find({user: req.userId, month:req.query.month, size: 2})
    .then( async (data)=>{
        if(data.length < 3){
            console.log('if',data.length)
            const user = await User.findOne({_id: req.userId})
            const newPackage = await new Package({
                ...req.body,
                user: req.userId
            }).save();
            const newPayment = await new Payment({
                ...req.body,
                item: 'meal',
                bill: newPackage.size*70,
                user: req.userId
            }).save();
            await User.updateOne({_id: req.userId}, {
                $push:{ payments: newPayment._id},
                $set: {
                    meal: 1,
                    coupon: user.coupon + newPackage.size*3
                }});
            await BalanceSheet.updateOne(
                { status: 1 },
                {$push: {mealBill: newPayment._id,}}
            );
            res.json(`Payment Successfull with ${newPackage.size} days package`)
        }
        else res.json(`Oopss! Payment unsuccessfull!`)
    })
    .catch(()=>res.json(`Oopss! Error!`))
})

router.get('/', checkLogin, async(req, res)=>{
    await Package.find({user: req.userId, month:req.query.month, size: 2})
    .then((data)=>{
        if(data.length < 3 ){
            res.json({
                status: 1,
                textAlert: `${3-data.length} times left`
            })
        }
        else{
            res.json({
                status: 0,
                textAlert: `Using limit exceeds`
            })
        }
    })
})

module.exports = router