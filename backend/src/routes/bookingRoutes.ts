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

router.post(
  "/",
  authenticateToken,
  requireRole(["CUSTOMER"]),
  validate(createBookingSchema),
  createBooking
);
router.patch(
  "/:id/status",
  authenticateToken,
  requireRole(["CUSTOMER", "TECHNICIAN"]),
  validate(updateBookingStatusSchema),
  updateBookingStatus
);
router.get(
  "/customer",
  authenticateToken,
  requireRole(["CUSTOMER"]),
  getCustomerBookings
);
router.get(
  "/technician",
  authenticateToken,
  requireRole(["TECHNICIAN"]),
  getTechnicianBookings
);

export default router;
