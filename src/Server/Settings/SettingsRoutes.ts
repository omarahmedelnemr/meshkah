import SettingsController from "./SettingsController";
import { Authorize } from "../../middleware/authorize";
const express = require('express');
const router = express()

// Change User's Username
router.post("/change_username", Authorize, SettingsController.change_username);

// Change User's Password
router.post("/change_password", Authorize, SettingsController.change_password);


export default router

