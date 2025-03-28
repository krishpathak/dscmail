const express=require('express');
const router=express.Router();
const Mail=require('../models/MailModel');

const verifyToken = require('../middleware/verifyToken');
router.post('/send',verifyToken,(req,res)=>{
    try{
        const {reciver_mail,body}=req.body;
        const 
        const mail=new Mail({
            reciver_mail:reciver_mail,
            body:body
            });
            mail.save()
            

    }
    catch(e){
        res.status(500).json({message:e.message});
    }
})