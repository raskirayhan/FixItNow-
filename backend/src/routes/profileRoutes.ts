import { Router } from "express";
import { getProfile, updateProfile, changePassword, updateTechnicianProfile } from "../controllers/profileController";
import { authenticateToken, requireRole } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { updateProfileSchema, changePasswordSchema, updateTechnicianProfileSchema } from "../schemas/validation";

const router = Router();

/**
 * @swagger
 * /profile/me:
 *   get:
 *     tags: [Profile]
 *     summary: Get current user's full profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved
 */
router.get("/me", authenticateToken, getProfile);

/**
 * @swagger
 * /profile/me:
 *   put:
 *     tags: [Profile]
 *     summary: Update current user's profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put("/me", authenticateToken, validate(updateProfileSchema), updateProfile);

/**
 * @swagger
 * /profile/change-password:
 *   put:
 *     tags: [Profile]
 *     summary: Change account password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password changed
 *       400:
 *         description: Current password incorrect
 */
router.put("/change-password", authenticateToken, validate(changePasswordSchema), changePassword);

/**
 * @swagger
 * /profile/technician:
 *   put:
 *     tags: [Profile]
 *     summary: Update technician profile (Technician only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *               experienceYears:
 *                 type: integer
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               baseHourlyRate:
 *                 type: number
 *     responses:
 *       200:
 *         description: Technician profile updated
 */
router.put("/technician", authenticateToken, requireRole(["TECHNICIAN"]), validate(updateTechnicianProfileSchema), updateTechnicianProfile);

export default router;
