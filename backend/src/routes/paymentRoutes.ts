import { Router } from "express";
import { createPaymentIntent, handleWebhook } from "../controllers/paymentController";
import { authenticateToken, requireRole } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { createPaymentSchema } from "../schemas/validation";

const router = Router();

/**
 * @swagger
 * /payments/create:
 *   post:
 *     tags: [Payments]
 *     summary: Create a Stripe payment intent (Customer only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookingId]
 *             properties:
 *               bookingId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Payment intent created
 *       400:
 *         description: Booking not in ACCEPTED status
 */
router.post(
  "/create",
  authenticateToken,
  requireRole(["CUSTOMER"]),
  validate(createPaymentSchema),
  createPaymentIntent
);

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     tags: [Payments]
 *     summary: Stripe webhook handler
 *     description: Receives Stripe webhook events for payment confirmation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed
 */
router.post("/webhook", handleWebhook);

export default router;
