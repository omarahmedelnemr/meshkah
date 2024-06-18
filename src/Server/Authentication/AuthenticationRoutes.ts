import AuthenticationController from "./AuthenticationController";
import { Authorize } from "../../middleware/authorize";
const express = require('express');
const router = express()

// Complete Signup Route 
router.post("/complete_signup", Authorize, AuthenticationController.Complete_Signup);

// Login Route 
router.post("/login", AuthenticationController.loginController);

// Sending Emails Route 
router.post("/send_email", AuthenticationController.send_email);

// Reseting New Password Route
router.post("/reset_password", AuthenticationController.reset_password);

export default router

