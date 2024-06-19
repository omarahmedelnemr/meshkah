import TracksModel from "./TracksModel";
import {Request,Response} from 'express';

class TracksController{
    // Get All Tracks That The Student Enroll in
    async enrolled_tracks(req:Request,res:Response) {
        const response = await TracksModel.enrolled_tracks(req.query)
        res.status(response['status']).json(response['data'])
    }

    // Get All Tracks That The Student Can Enroll in
    async open_tracks(req:Request,res:Response) {
        const response = await TracksModel.open_tracks(req.query)
        res.status(response['status']).json(response['data'])
    }
}

export default new TracksController();
