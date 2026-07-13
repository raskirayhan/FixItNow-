import { Router } from "express";
import prisma from "../config/db";
import {
  createService,
  getServices,
  getServiceById,
  getTechnicianServices,
} from "../controllers/serviceController";
import { authenticateToken, requireRole } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { createServiceSchema } from "../schemas/validation";

const router = Router();

router.get("/categories", async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { services: true } } },
      orderBy: { name: "asc" },
    });
    res.status(200).json({
      success: true,
      message: "Categories retrieved",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", getServices);
router.get("/technician/:technicianId", getTechnicianServices);
router.get("/:id", getServiceById);
router.post(
  "/",
  authenticateToken,
  requireRole(["TECHNICIAN"]),
  validate(createServiceSchema),
  createService
);

export default router;
