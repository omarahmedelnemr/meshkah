import SuperAdminModel from "./SuperAdminModel";
import {Request,Response} from 'express';

class SuperAdminController{
    // Get All Admin List
    async getAdminsList(req:Request,res:Response) {
        const response = await SuperAdminModel.getAdminsList(req.query)
        res.status(response['status']).json(response['data'])
    }

    // Generate a JWT to Add New Admin
    async CreateNewAdminLink(req:Request,res:Response) {
        const response = await SuperAdminModel.CreateNewAdminLink(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Change Admin Permission
    async ChangeAdminPermission(req:Request,res:Response) {
        const response = await SuperAdminModel.ChangeAdminPermission(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Remove Admin
    async RemoveAdmin(req:Request,res:Response) {
        const response = await SuperAdminModel.RemoveAdmin(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Create New Track
    async AddNewTrack(req:Request,res:Response) {
        const response = await SuperAdminModel.AddNewTrack(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Assign Track To Admin
    async AssignTrack(req:Request,res:Response) {
        const response = await SuperAdminModel.AssignTrack(req.body)
        res.status(response['status']).json(response['data'])
    }
    
    // Remove Assign Track From Admin
    async unAssignTrack(req:Request,res:Response) {
        const response = await SuperAdminModel.unAssignTrack(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Generate a Link For Track Registration
    async GenerateRegistrationLink(req:Request,res:Response) {
        const response = await SuperAdminModel.GenerateRegistrationLink(req.query)
        res.status(response['status']).json(response['data'])
    }

    // Extend Track Close-Date
    async OpenTrackForEnrollment(req:Request,res:Response) {
        const response = await SuperAdminModel.OpenTrackForEnrollment(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Close the Track (Modify Track Close-Date to Now)
    async CloseTrackEnrollment(req:Request,res:Response) {
        const response = await SuperAdminModel.CloseTrackEnrollment(req.body)
        res.status(response['status']).json(response['data'])
    }
}

export default new SuperAdminController();
