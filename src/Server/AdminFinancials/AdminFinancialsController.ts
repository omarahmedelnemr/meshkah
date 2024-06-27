import AdminFinancialsModel from "./AdminFinancialsModel";
import {Request,Response} from 'express';

class AdminFinancialsController{
    // Get All Financials Records
    async getAllFinancials(req:Request,res:Response) {
        const response = await AdminFinancialsModel.getAllFinancials(req.query)
        res.status(response['status']).json(response['data'])
    }

    // Edit Track Expenses
    async EditTrackExpenses(req:Request,res:Response) {
        const response = await AdminFinancialsModel.EditTrackExpenses(req.body)
        res.status(response['status']).json(response['data'])
    }

    // Submit New or Edited Attendance Sheet
    async SubmitFinancialSheet(req:Request,res:Response) {
        const response = await AdminFinancialsModel.SubmitFinancialSheet(req.body)
        res.status(response['status']).json(response['data'])
    }
}

export default new AdminFinancialsController();
