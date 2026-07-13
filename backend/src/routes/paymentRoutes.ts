import { Router } from "express";
import { createPaymentIntent, handleWebhook } from "../controllers/paymentController";
import { authenticateToken, requireRole } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { createPaymentSchema } from "../schemas/validation";

const router = Router();

router.post(
  "/create",
  authenticateToken,
  requireRole(["CUSTOMER"]),
  validate(createPaymentSchema),
  createPaymentIntent
);

router.post("/webhook", handleWebhook);

export default router;
