import { Router } from "express";
import {
  createBooking,
  updateBookingStatus,
  getCustomerBookings,
  getTechnicianBookings,
} from "../controllers/bookingController";
import { authenticateToken, requireRole } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { createBookingSchema, updateBookingStatusSchema } from "../schemas/validation";

const router = Router();

/**
 * @swagger
 * /bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Create a new booking (Customer only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serviceId, scheduledAt]
 *             properties:
 *               serviceId:
 *                 type: string
 *                 format: uuid
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *               timeSlot:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created
 *       400:
 *         description: Cannot book own service
 */
router.post(
  "/",
  authenticateToken,
  requireRole(["CUSTOMER"]),
  validate(createBookingSchema),
  createBooking
);

/**
 * @swagger
 * /bookings/{id}/status:
 *   patch:
 *     tags: [Bookings]
 *     summary: Update booking status
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACCEPTED, DECLINED, IN_PROGRESS, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Status updated
 *       400:
 *         description: Invalid transition
 */
router.patch(
  "/:id/status",
  authenticateToken,
  requireRole(["CUSTOMER", "TECHNICIAN"]),
  validate(updateBookingStatusSchema),
  updateBookingStatus
);

/**
 * @swagger
 * /bookings/customer:
 *   get:
 *     tags: [Bookings]
 *     summary: Get current customer's bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer bookings retrieved
 */
router.get(
  "/customer",
  authenticateToken,
  requireRole(["CUSTOMER"]),
  getCustomerBookings
);

/**
 * @swagger
 * /bookings/technician:
 *   get:
 *     tags: [Bookings]
 *     summary: Get current technician's bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Technician bookings retrieved
 */
router.get(
  "/technician",
  authenticateToken,
  requireRole(["TECHNICIAN"]),
  getTechnicianBookings
);

export default router;
