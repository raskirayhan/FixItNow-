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
import { banUserSchema } from "../schemas/validation";

const router = Router();

router.use(authenticateToken, requireRole(["ADMIN"]));

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Get dashboard statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved
 */
router.get("/stats", getDashboardStats);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users retrieved
 */
router.get("/users", getAllUsers);

/**
 * @swagger
 * /admin/users/{id}/ban:
 *   patch:
 *     tags: [Admin]
 *     summary: Ban or unban a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, BANNED]
 *     responses:
 *       200:
 *         description: User status updated
 */
router.patch("/users/:id/ban", validate(banUserSchema), banUser);

/**
 * @swagger
 * /admin/bookings:
 *   get:
 *     tags: [Admin]
 *     summary: Get all bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All bookings retrieved
 */
router.get("/bookings", getAllBookings);

/**
 * @swagger
 * /admin/categories:
 *   get:
 *     tags: [Admin]
 *     summary: Get all categories with service counts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved
 */
router.get("/categories", getAllCategories);

export default router;
