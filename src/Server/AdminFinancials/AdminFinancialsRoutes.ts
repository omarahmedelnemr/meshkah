import AdminFinancialsController from "./AdminFinancialsController";
import { AuthorizeAdmin } from "../../middleware/authorizeAdmin";
const express = require('express');
const router = express()


// Get All Attendance Records
router.get("/financial_sheet", AuthorizeAdmin, AdminFinancialsController.getAllFinancials);

// Edit Track Expenses
router.post("/expenses_edit", AuthorizeAdmin, AdminFinancialsController.EditTrackExpenses);

// Get All Attendance Records
router.post("/financial_sheet", AuthorizeAdmin, AdminFinancialsController.SubmitFinancialSheet);

export default router

