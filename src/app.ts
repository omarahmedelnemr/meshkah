// const multer = require('multer')
var cors = require('cors')
const express = require('express');
const app = express()
const cookieParser = require('cookie-parser');

app.set('Access-Control-Allow-Origin', '*');

// app.use(cors()) 
app.use(cors({
    origin:true,
    credentials:true
}));

app.use(express.json());
app.use(cookieParser());

app.use(express.static(__dirname+'/views'))
app.get('/',async (req,res)=>{
    res.status(200).json("Welcome to Meshkah API")
})


export default app