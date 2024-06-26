import {Request,Response} from 'express';
import AdminLectureModel from "./AdminLectureModel";

class AuthenticationController{
    // Get All Lectures Related to a Track 
    async getAllLectures(req:Request,res:Response) {
        const response = await AdminLectureModel.getAllLectures(req.query)
        res.status(response['status']).json(response['data'])
    }

    // get a Tasks Related to a Given Lecture
    async getAllLectureTasks(req:Request,res:Response) {
        const response = await AdminLectureModel.getAllLectureTasks(req.query)
        res.status(response['status']).json(response['data'])
    }

    // get a Materials Related to a Given Lecture
    async getAllLectureMaterials(req:Request,res:Response) {
        const response = await AdminLectureModel.getAllLectureMaterials(req.query)
        res.status(response['status']).json(response['data'])
    }

    // Add New Lecture to a Track
    async addNewLecture(req:Request,res:Response) {
        const response = await AdminLectureModel.addNewLecture(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Edit the Lecture Data Like Name, Date
    async EditLectureInfo(req:Request,res:Response) {
        const response = await AdminLectureModel.EditLectureData(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Add New Task to a Lecture
    async addNewTask(req:Request,res:Response) {
        const response = await AdminLectureModel.addNewTask(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Add New Material to a Lecture
    async addNewMaterial(req:Request,res:Response) {
        const response = await AdminLectureModel.addNewMaterial(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Remove a Lecture
    async ArchiveLecture(req:Request,res:Response) {
        const response = await AdminLectureModel.ArchiveLecture(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Remove a Task
    async RemoveTask(req:Request,res:Response) {
        const response = await AdminLectureModel.RemoveTask(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Remove a Material
    async RemoveMaterial(req:Request,res:Response) {
        const response = await AdminLectureModel.RemoveMaterial(req.body)
        res.status(response['status']).json(response['data'])
    }
}

export default new AuthenticationController();
