const express = require('express');
const router = express()


router.get('/',async (req,res)=>{
    res.send("\
        <div style='display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%;height:100vh;background-color:#dfdfdf'>\
            <h1 >Welcome to Meshkah API (Zaki Side)</h1>\
            <h2><a href='/'>Go Back To General</a></h2>\
        </div>")
})


export default router