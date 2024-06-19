import LecturesModel from "./LecturesModel";
import {Request,Response} from 'express';

class LecturesController{
    // Get all Lectures List with track ID
    async getAllLectures(req:Request,res:Response) {
        const response = await LecturesModel.getAllLectures(req.query)
        res.status(response['status']).json(response['data'])
    }

    // Get a Lecture Materials
    async GetLectureMaterials(req:Request,res:Response) {
        const response = await LecturesModel.GetLectureMaterials(req.query)
        res.status(response['status']).json(response['data'])
    }

    // Get a Lecture Tasks
    async GetLectureTasks(req:Request,res:Response) {
        const response = await LecturesModel.GetLectureTasks(req.query)
        res.status(response['status']).json(response['data'])
    }
}

export default new LecturesController();
