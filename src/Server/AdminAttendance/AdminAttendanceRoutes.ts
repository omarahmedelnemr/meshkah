import AdminAttendanceController from "./AdminAttendanceController";
import { AuthorizeAdmin } from "../../middleware/authorizeAdmin";
const express = require('express');
const router = express()

// Example:
// Get All Attendance Records
router.get("/attendance_sheet", AuthorizeAdmin, AdminAttendanceController.getAllAttendance);

// Submit New or Edited Attendance Sheet
router.post("/attendance_sheet", AuthorizeAdmin, AdminAttendanceController.SubmitAttendanceSheet);

export default router

