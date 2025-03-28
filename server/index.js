const connectToMongo = require('./db');
connectToMongo();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const port=8000;
const userRoutes = require('./routes/user');

const session = require('express-session');
const cors= require('cors');
const authRoutes = require("./routes/user");
app.use(cookieParser());
app.use(express.json());


require('dotenv').config()
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
         secure: true,
         maxAge: 7 * 24 * 60 * 60 * 1000, 
         httpOnly: false,
    }
}));
app.use(cors(
    {
        origin: ['http://localhost:3000','https://quiz-app-client-pink.vercel.app/'],
        method: ['GET','POST','PUT','DELETE'],
        credentials: true
    }
))


app.get('/createToken/:token' ,(req,res)=>{
    try{
        res.cookie('mail_token', String(req.params.token), {
            maxAge: 24 * 60 * 60 * 1000 * 3, 
        }).json({ message: "success" });
    }catch(e){
        console.log(e);
        res.status(500).json({message:e.message})
    }
})

app.use('/auth',authRoutes)
app.get('/',(req,res)=>{
    res.send("server is running");
})

app.listen(port,()=>{
    console.log(`Server is on port ${port}`);
})