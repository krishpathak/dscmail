const express=require('express');
const router=express.Router();
const Mail=require('../models/MailModel');

const verifyToken = require('../middleware/verifyToken');
const User = require('../models/User');
router.post('/send',verifyToken,async (req,res)=>{
    try{
        const {reciever_mail,body,subject}=req.body;
        const {user}=await User.findOne({email:reciver});
        const mail=new Mail({
            subject:subject,
            mail_sender:req.id,
            mail_reciever:reciever_mail,
            body:body
            });
            mail.save()
    }
    catch(e){
        res.status(500).json({message:e.message});
    }
})

router.get('/sent',verifyToken,async (req,res)=>{
    try{
        const {mail}=await Mail.findAll({mail_sender:req.id});
        res.status.json(mail);
    }
    catch(e){
        res.status(500).json({message:e.message});
    }
})

router.get('/recieved',verifyToken,async(req,res)=>{
    try{
        const {mail}=await Mail.findAll({mail_reciever:req.id});
        res.status(200).send(mail);
    }
    catch(e){
        res.status(500).json({message:e.message});
    }
})

module.exports=router;