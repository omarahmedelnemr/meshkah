import AdminAuthednticationController from "./AdminAuthednticationController";
import { AuthorizeAdmin } from "../../middleware/authorizeAdmin";
const express = require('express');
const router = express()

// Admin Sign-up:
router.post("/signup", AuthorizeAdmin, AdminAuthednticationController.AdminSignup);


export default router

