import TodoController from "./TodoController";
import { Authorize } from "../../middleware/authorize";
const express = require('express');
const router = express()

// Get The Tasks That Are Not Done
router.get("/tasks", Authorize, TodoController.GetNotDoneTasks);

// Get The Tasks That Are Done
router.get("/done_tasks", Authorize, TodoController.GetDoneTasks);

// Mark Task as Done
router.post("/mark_done", Authorize, TodoController.MarkDone);

// Mark Task as Not Done
router.post("/mark_not_done", Authorize, TodoController.MarkNotDone);


export default router

