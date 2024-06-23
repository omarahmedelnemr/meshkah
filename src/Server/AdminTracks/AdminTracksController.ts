import AdminTracksModel from "./AdminTracksModel";
import {Request,Response} from 'express';

class AdminTracksController{
    
    // Get all Track that is Assigned to the Admin By the Super-Admin:
    async assigned_tracks(req:Request,res:Response) {
        const response = await AdminTracksModel.assigned_tracks(req.query)
        res.status(response['status']).json(response['data'])
    }

    // Change the Weekly Date of the Lecture if Somthing Happened
    async change_weekly_date(req:Request,res:Response) {
        const response = await AdminTracksModel.assigned_tracks(req.query)
        res.status(response['status']).json(response['data'])
    }
}

export default new AdminTracksController();
