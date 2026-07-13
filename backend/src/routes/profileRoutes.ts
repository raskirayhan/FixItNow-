import { Router } from "express";
import { getProfile, updateProfile, changePassword, updateTechnicianProfile } from "../controllers/profileController";
import { authenticateToken, requireRole } from "../middlewares/auth";

const router = Router();
router.get("/me", authenticateToken, getProfile);
router.put("/me", authenticateToken, updateProfile);
router.put("/change-password", authenticateToken, changePassword);
router.put("/technician", authenticateToken, requireRole(["TECHNICIAN"]), updateTechnicianProfile);
export default router;
