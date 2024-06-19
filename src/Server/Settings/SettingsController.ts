import SettingsModel from "./SettingsModel";
import {Request,Response} from 'express';

class SettingsController{
    
    // Change User's Username
    async change_username(req:Request,res:Response) {
        const response = await SettingsModel.change_username(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Change User's Password
    async change_password(req:Request,res:Response) {
        const response = await SettingsModel.change_password(req.body)
        res.status(response['status']).json(response['data'])
    }
    
}

export default new SettingsController();
