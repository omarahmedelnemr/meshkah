import TodoModel from "./TodoModel";
import {Request,Response} from 'express';

class TodoController{
    // Get The Tasks That Are Not Done
    async GetNotDoneTasks(req:Request,res:Response) {
        const response = await TodoModel.GetNotDoneTasks(req.query)
        res.status(response['status']).json(response['data'])
    }

    // Get The Tasks That Are  Done
    async GetDoneTasks(req:Request,res:Response) {
        const response = await TodoModel.GetDoneTasks(req.query)
        res.status(response['status']).json(response['data'])
    }

    // Mark Task as Done
    async MarkDone(req:Request,res:Response) {
        const response = await TodoModel.MarkDone(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Mark Task as Not Done
    async MarkNotDone(req:Request,res:Response) {
        const response = await TodoModel.MarkNotDone(req.body)
        res.status(response['status']).json(response['data'])
    }
}

export default new TodoController();
