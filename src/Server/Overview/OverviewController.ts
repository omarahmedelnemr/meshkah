
import overviewModel from "./overviewModel";
import {Request,Response} from 'express';

class OverviewController{
    // Get Overview on Finanials
    async getFinanials(req:Request,res:Response) {
        const response = await overviewModel.GetFinanials(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Get Overview on Assignments
    async getAssignments(req:Request,res:Response) {
        const response = await overviewModel.GetAssignmentsOverview(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Get Overview on Statistics
    async getStatistics(req:Request,res:Response) {
        const response = await overviewModel.GetStatisticsOverview(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Get The Next Lecture Date
    async getNextLecture(req:Request,res:Response) {
        const response = await overviewModel.GetNextLecture(req.body)
        res.status(response['status']).json(response['data'])
    }

}

export default new OverviewController();
