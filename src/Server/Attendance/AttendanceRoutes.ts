import AttendanceController from "./AttendanceController";
import { Authorize } from "../../middleware/authorize";
const express = require('express');
const router = express()

// Get All Attendance Records:
router.get("/attendance", Authorize, AttendanceController.getAllAttendance);


export default router

