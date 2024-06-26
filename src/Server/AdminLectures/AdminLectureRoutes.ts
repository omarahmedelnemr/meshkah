import AdminLectureController from "./AdminLectureController";
import { AuthorizeAdmin } from "../../middleware/authorizeAdmin";
const express = require('express');
const router = express()

// Get All Lectures Related to a Track 
router.get("/lectures", AuthorizeAdmin, AdminLectureController.getAllLectures);

// get a Tasks Related to a Given Lecture
router.get("/lecture_tasks", AuthorizeAdmin, AdminLectureController.getAllLectureTasks);

// get a Materials Related to a Given Lecture
router.get("/lecture_materials", AuthorizeAdmin, AdminLectureController.getAllLectureMaterials);

// Add New Lecture to a Track
router.post("/new_lecture", AuthorizeAdmin, AdminLectureController.addNewLecture);

// Edit the Lecture Data Like Name, Date
router.post("/lecture_edit", AuthorizeAdmin, AdminLectureController.EditLectureInfo);

// Add New Material to a Lecture
router.post("/new_material", AuthorizeAdmin, AdminLectureController.addNewMaterial);

// Add New Task to a Lecture
router.post("/new_task", AuthorizeAdmin, AdminLectureController.addNewTask);

// Remove a Lecture
router.delete("/lecture", AuthorizeAdmin, AdminLectureController.ArchiveLecture);

// Remove Task
router.delete("/task", AuthorizeAdmin, AdminLectureController.RemoveTask);

// Remove Task
router.delete("/material", AuthorizeAdmin, AdminLectureController.RemoveMaterial);



export default router

