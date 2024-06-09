import AuthenticationModel from "../Models/AuthenticationModel";
import {Request,Response} from 'express';
var jwt = require('jsonwebtoken');

class AuthenticationController{
    
    // Controller for Login Route 
    async loginController (req:Request,res:Response) {
        const response = await AuthenticationModel.login(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Controller for email sending Route 
    async send_email (req:Request,res:Response) {
        const response = await AuthenticationModel.send_email(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Controller for resetting New Password Route 
    async reset_password (req:Request,res:Response) {
        const response = await AuthenticationModel.reset_password(req.body)
        res.status(response['status']).json(response['data'])
    }
}

export default new AuthenticationController();
