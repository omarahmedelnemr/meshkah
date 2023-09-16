
import elnemrRouter from './Server/elnemr'
import tajRouter from './Server/taj'
import zakiRouter from './Server/zaki'

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

app.use("/elnemr",elnemrRouter)
app.use("/zaki",zakiRouter)
app.use("/taj",tajRouter)


app.get('/',async (req,res)=>{
    res.send("\
        <div style='display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%;height:100vh;background-color:#dfdfdf'>\
            <h1 >Congrats, Meshkah API is Working :D(General Side)</h1>\
            <h2><a href='/taj'>Go To Taj Side</a></h2>\
            <h2><a href='/zaki'>Go To Zaki Side</a></h2>\
            <h2><a href='/elnemr'>Go To Elnemr Side</a></h2>\
        </div>")
})


export default app