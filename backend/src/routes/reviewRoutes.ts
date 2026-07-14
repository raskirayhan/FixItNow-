import { Router } from "express";
import { createReview, getTechnicianReviews } from "../controllers/reviewController";
import { authenticateToken, requireRole } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { createReviewSchema } from "../schemas/validation";

const router = Router();

/**
 * @swagger
 * /reviews/technician/{technicianId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get reviews for a technician
 *     parameters:
 *       - in: path
 *         name: technicianId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Reviews retrieved
 */
router.get("/technician/:technicianId", getTechnicianReviews);

/**
 * @swagger
 * /reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Create a review for a completed booking (Customer only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookingId, rating]
 *             properties:
 *               bookingId:
 *                 type: string
 *                 format: uuid
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review submitted
 *       400:
 *         description: Booking not completed
 *       409:
 *         description: Already reviewed
 */
router.post(
  "/",
  authenticateToken,
  requireRole(["CUSTOMER"]),
  validate(createReviewSchema),
  createReview
);

export default router;
