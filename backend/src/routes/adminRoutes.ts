import { Router } from "express";
import {
  getAllUsers,
  banUser,
  getAllBookings,
  getDashboardStats,
  getAllCategories,
} from "../controllers/adminController";
import { authenticateToken, requireRole } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { adminUpdateUserSchema } from "../schemas/validation";

const router = Router();

router.use(authenticateToken, requireRole(["ADMIN"]));

router.get("/users", getAllUsers);
router.patch("/users/:id/ban", validate(adminUpdateUserSchema), banUser);
router.get("/bookings", getAllBookings);
router.get("/stats", getDashboardStats);
router.get("/categories", getAllCategories);

export default router;
