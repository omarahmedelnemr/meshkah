import responseGenerator from "../../middleware/responseGenerator";
import {Request,Response} from 'express';
import AdminAttendanceModel from "./AdminAttendanceModel";

class AdminAttendanceController{
    // Get All Attendance Records
    async getAllAttendance(req:Request,res:Response) {
        const response = await AdminAttendanceModel.getAllAttendance(req.query)
        res.status(response['status']).json(response['data'])
    }

    // Submit New or Edited Attendance Sheet
    async SubmitAttendanceSheet(req:Request,res:Response) {
        const response = await AdminAttendanceModel.SubmitAttendanceSheet(req.body)
        res.status(response['status']).json(response['data'])
    }
}

export default new AdminAttendanceController();
