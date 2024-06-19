import TracksController from "./TracksController";
import { Authorize } from "../../middleware/authorize";
const express = require('express');
const router = express()


// Get All Tracks That The Student Enroll in
router.get("/enrolled_tracks", Authorize, TracksController.enrolled_tracks);

// Get All Tracks That The Student Can Enroll in
router.get("/open_tracks", Authorize, TracksController.open_tracks);

export default router

