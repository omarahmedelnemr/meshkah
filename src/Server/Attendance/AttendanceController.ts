import AttendanceModel from "./AttendanceModel";
import {Request,Response} from 'express';

class AttendanceController{
    
    // Get All Attendance Records
    async getAllAttendance(req:Request,res:Response) {
        const response = await AttendanceModel.getAllAttendance(req.query)
        res.status(response['status']).json(response['data'])
    }
}

export default new AttendanceController();
