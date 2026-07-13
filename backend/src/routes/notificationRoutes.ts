import { Router } from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController";
import { authenticateToken } from "../middlewares/auth";

const router = Router();
router.get("/", authenticateToken, getNotifications);
router.patch("/read-all", authenticateToken, markAllAsRead);
router.patch("/:id/read", authenticateToken, markAsRead);
export default router;
