import LecturesController from "./LecturesController";
import { Authorize } from "../../middleware/authorize";
const express = require('express');
const router = express()

// Get all Lectures List with track ID
router.get("/lectures", Authorize, LecturesController.getAllLectures);

// Get a Lecture Materials
router.get("/lecture_materials", Authorize, LecturesController.GetLectureMaterials);

// Get a Lecture Tasks
router.get("/lecture_tasks", Authorize, LecturesController.GetLectureTasks);


export default router

