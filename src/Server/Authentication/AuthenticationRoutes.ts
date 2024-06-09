import AuthenticationController from "./AuthenticationController";
import { Authorize } from "../../middleware/authorize";
const express = require('express');
const router = express()

// Login Route 
router.post("/login", Authorize, AuthenticationController.loginController);

// Sending Emails Route 
router.post("/send_email", Authorize, AuthenticationController.send_email);

// Reseting New Password Route
router.post("/reset_password", Authorize, AuthenticationController.reset_password);

export default router

