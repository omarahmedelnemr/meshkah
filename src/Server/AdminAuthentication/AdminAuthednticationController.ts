import AdminAuthednticationModel from "./AdminAuthednticationModel";
import {Request,Response} from 'express';

class AdminAuthednticationController{
    // Singup For Admin
    async AdminSignup(req:Request,res:Response) {
        const response = await AdminAuthednticationModel.AdminSignup(req.body)
        res.status(response['status']).json(response['data'])
    }
}

export default new AdminAuthednticationController();
