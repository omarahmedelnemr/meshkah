import OverviewController from "./OverviewController";
import { Authorize } from "../../middleware/authorize";
const express = require('express');
const router = express()

// Get Overview on Finanials
router.get("/financials", Authorize, OverviewController.getFinanials);

// Get Overview on Assignments
router.get("/assignments_overview", Authorize, OverviewController.getAssignments);

// Get Overview on Statistics
router.get("/statistics_overview", Authorize, OverviewController.getStatistics);

// Get The Next Lecture Date
router.get("/next_lecture", Authorize, OverviewController.getNextLecture);


export default router

