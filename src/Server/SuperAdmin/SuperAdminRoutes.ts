import SuperAdminController from "./SuperAdminController";
import { AuthorizeSuperAdmin } from "../../middleware/authorizeSuperAdmin";
const express = require('express');
const router = express()

// Get All Admin List
router.get("/admins_list", AuthorizeSuperAdmin, SuperAdminController.getAdminsList);

// Generate a JWT to Add New Admin
router.get("/admins_link", AuthorizeSuperAdmin, SuperAdminController.CreateNewAdminLink);

// Change Admin Permission
router.post("/change_permissions", AuthorizeSuperAdmin, SuperAdminController.ChangeAdminPermission);

// Remove Admin
router.delete("/delete_admin", AuthorizeSuperAdmin, SuperAdminController.RemoveAdmin);

// Create New Track
router.post("/new_track", AuthorizeSuperAdmin, SuperAdminController.AddNewTrack);

// Assign Track To Admin
router.post("/assign_track", AuthorizeSuperAdmin, SuperAdminController.AssignTrack);

// Remove Assign Track From Admin
router.delete("/assign_track", AuthorizeSuperAdmin, SuperAdminController.unAssignTrack);

// Generate a Link For Track Registration
router.get("/registration_link", AuthorizeSuperAdmin, SuperAdminController.GenerateRegistrationLink);

// Extend Track Close-Date
router.get("/extend_enrollment", AuthorizeSuperAdmin, SuperAdminController.OpenTrackForEnrollment);

// Close the Track (Modify Track Close-Date to Now)
router.get("/close_enrollment", AuthorizeSuperAdmin, SuperAdminController.CloseTrackEnrollment);

export default router

