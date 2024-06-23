
import {Request,Response} from 'express';

var jwt = require('jsonwebtoken');

export async function AuthorizeAdmin(req:Request,res:Response,next:any){
    // next()

    if(process.env.ENV == 'dev'){
        next()   
    }else{
        // Commented For Testing
        const token = req.headers['authorization']
        try{
            const jwtData = await jwt.verify(token,process.env.JWTsecret)
            if(jwtData['userType'] !== 'admin'){
                throw Error("unauthorized")
            }
            // If we reach Here, This Means That The JWT Passed the Check, Otherwise it will Caue an Error         
            next()
            
        }catch{
            res.status(401).json("unauthorized")
            
        }
    }
    

}