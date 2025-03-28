const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const verifyToken = require("../middleware/verifyToken")
const nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET;
router.post('/cheak', [
    body('email', "Enter the correct email").isEmail(),
    body('password', "Enter mininmun 6 letter passowrd").isLength(6)
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    let user = await User.findOne({ email: req.body.email });

    if (user) {
        return res.status(400).json({ message: "The account with this email id already exist" });
    }
    let name = await User.findOne({ username: req.body.username });
    if (name) {
        return res.status(400).json({ message: "The person which has this username already exist. Choose different username" });
    }
    function OTP() {
        const min = 100000;
        const max = 999999;
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    }
    const otp = OTP();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.PASSWORD
        }
    })

    const mailoptions = {
        from: process.env.EMAIL_ID,
        to: req.body.email,
        subject: `OTP for Quizy`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Notification</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #74ebd5, #9face6);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            padding: 30px;
            text-align: center;
            max-width: 400px;
            width: 100%;
            position: relative;
        }

        h1 {
            font-size: 26px;
            margin-bottom: 15px;
            color: #333;
        }

        p {
            font-size: 18px;
            margin: 10px 0;
            color: #555;
        }

        .otp {
            font-weight: bold;
            color: #007bff;
            font-size: 24px;
            background: #e7f3ff;
            padding: 10px;
            border-radius: 8px;
            display: inline-block;
            margin: 10px 0;
        }

        .note {
            font-size: 16px;
            color: #888;
            margin-top: 20px;
        }

        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #aaa;
        }

        .icon {
            position: absolute;
            top: -20px;
            left: calc(50% - 20px);
            font-size: 40px;
            color: #007bff;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">🔑</div>
        <h1>OTP Notification</h1>
        <p>The OTP for logging in to Quizy is <span class="otp">${otp}</span>.</p>
        <p class="note">Do not share it with anyone.</p>
        <div class="footer">If you did not request this, please ignore.</div>
    </div>
</body>
</html>
`

    }
    transporter.sendMail(mailoptions, (error, info) => {
        if (error) {
            console.log("email is not sent");
        } else {
            console.log("email is sent successfully");
        }
    })
    res.json({ 'okay': 123, 'otp': otp });
}
)
router.post('/signup', [
    body('email', "Enter the correct email").isEmail(),
    body('password', "Enter mininmun 6 letter passowrd").isLength(6)
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ message: "The account with this email id already exist" });
        }
        let name = await User.findOne({ username: req.body.username });
        if (name) {
            return res.status(400).json({ message: "The person which has this username already exist. Choose different username" });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt)

        user = new User({
            username: req.body.username,
            email: req.body.email,
            password: secPass
        })

        const data = {
            user: {
                id: user.id
            }
        }

        await user.save();
        const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: '7 days' })
        // console.log(authToken);
        res.redirect(`/createToken/${authToken}`)


    } catch (err) {
        return res.status(404).json({ message: "Sorry! Server error has been detected" })
    }

})
//Login for user data
router.post('/login', [
    body('password', ({ message: "Enter mininmun 6 letter password" })).isLength(6)
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }

    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(400).json({ message: "Sorry! User has been not exist" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const data = {
            user: {
                username: user.username,
                password: user.password
            }
        }

        const data1 = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data1, JWT_SECRET, { expiresIn: '7 days' })
        
        res.redirect(`/createToken/${authToken}`)

    }
    catch(err) {
        // console.log(err)
        return res.status(500).json({ message: "Sorry! Server error has been detected" })
    }
})
//Forget password
router.post('/getotp', async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: "This email is not registered" });
    }
    function OTP() {
        const min = 100000;
        const max = 999999;
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    }
    const otp = OTP();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.PASSWORD
        }
    })

    const mailoptions = {
        from: process.env.EMAIL_ID,
        to: req.body.email,
        subject: `OTP for Musicify`,
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Notification</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #74ebd5, #9face6);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            padding: 30px;
            text-align: center;
            max-width: 400px;
            width: 100%;
            position: relative;
        }

        h1 {
            font-size: 26px;
            margin-bottom: 15px;
            color: #333;
        }

        p {
            font-size: 18px;
            margin: 10px 0;
            color: #555;
        }

        .otp {
            font-weight: bold;
            color: #007bff;
            font-size: 24px;
            background: #e7f3ff;
            padding: 10px;
            border-radius: 8px;
            display: inline-block;
            margin: 10px 0;
        }

        .note {
            font-size: 16px;
            color: #888;
            margin-top: 20px;
        }

        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #aaa;
        }

        .icon {
            position: absolute;
            top: -20px;
            left: calc(50% - 20px);
            font-size: 40px;
            color: #007bff;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">🔑</div>
        <h1>OTP Notification</h1>
        <p>The OTP for changing password in to Quizy is <span class="otp">${otp}</span>.</p>
        <p class="note">Do not share it with anyone.</p>
        <div class="footer">If you did not request this, please ignore.</div>
    </div>
</body>
</html>
`
    }
    transporter.sendMail(mailoptions, (error, info) => {
        if (error) {
            console.log("email is not sent");
        } else {
            console.log("email is sent successfully");
        }
    })
    res.json({ 'okay': 123, 'otp': otp });
}
)
router.put('/changepass', async (req, res) => {

    const errors = validationResult(req);
    console.log(req.body);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(500).json({ message: "Unauthorised access of user" });
    }
    const password = req.body.password
    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) {
        user.save();
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt)
        user.password = secPass
        user.save();
        res.json({ data: "Password changed succesfully" })
    }
    else {
        return res.status(500).json({ message: "New password is same as old password" })
    }
}
)

// router.get('/:id',async(req,res)=>{
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.status(200).json(user);
// })

// router.get('/check/:id',verifyToken,async(req,res)=>{
//     try{
//         const id=req.params.id;
//         if(id==req.id){
//             return res.status(200).json({ message: 'true' });
//         }
//         return res.status(200).json({message:'false'});
//     }catch(e){
//         console.log(e);
//         return res.status(500).json({ message: 'Server error' });
//     }
// })
 


module.exports = router