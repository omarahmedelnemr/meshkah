import TracksController from "./TracksController";
import { Authorize } from "../../middleware/authorize";
const express = require('express');
const router = express()


// Get All Tracks That The Student Enroll in
router.get("/enrolled_tracks", Authorize, TracksController.enrolled_tracks);

// Get All Tracks That The Student Can Enroll in
router.get("/open_tracks", Authorize, TracksController.open_tracks);

// Get Track Info, User doesn't has to Be Logged In, But only has Any Token From the Server-side (JWT)
router.get("/track_info", TracksController.TrackInfo);

// Register in a Selected Track
router.post("/track_register", Authorize, TracksController.RegisterInTrack);

export default router

