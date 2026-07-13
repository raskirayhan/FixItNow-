import { Router } from "express";
import { createReview, getTechnicianReviews } from "../controllers/reviewController";
import { authenticateToken, requireRole } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { createReviewSchema } from "../schemas/validation";

const router = Router();

router.get("/technician/:technicianId", getTechnicianReviews);

router.post(
  "/",
  authenticateToken,
  requireRole(["CUSTOMER"]),
  validate(createReviewSchema),
  createReview
);

export default router;
