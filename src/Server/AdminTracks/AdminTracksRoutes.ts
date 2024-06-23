import AdminTracksController from "./AdminTracksController";
import { AuthorizeAdmin } from "../../middleware/authorizeAdmin";
const express = require('express');
const router = express()

// Get all Track that is Assigned to the Admin By the Super-Admin:
router.get("/assigned_tracks", AuthorizeAdmin, AdminTracksController.assigned_tracks);

// Change the Weekly Date of the Lecture if Somthing Happened
router.get("/change_weekly_date", AuthorizeAdmin, AdminTracksController.change_weekly_date);

export default router

