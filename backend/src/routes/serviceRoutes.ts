import { Router } from "express";
import {
  createService,
  getServices,
  getServiceById,
  getTechnicianServices,
  getCategories,
} from "../controllers/serviceController";
import { authenticateToken, requireRole } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { createServiceSchema } from "../schemas/validation";

const router = Router();

/**
 * @swagger
 * /services/categories:
 *   get:
 *     tags: [Services]
 *     summary: Get all service categories
 *     responses:
 *       200:
 *         description: Categories retrieved
 */
router.get("/categories", getCategories);

/**
 * @swagger
 * /services:
 *   get:
 *     tags: [Services]
 *     summary: List all services with optional filters
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or description
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by category
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Minimum average rating
 *     responses:
 *       200:
 *         description: Services retrieved
 */
router.get("/", getServices);

/**
 * @swagger
 * /services/technician/{technicianId}:
 *   get:
 *     tags: [Services]
 *     summary: Get all services by a technician
 *     parameters:
 *       - in: path
 *         name: technicianId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Technician services retrieved
 */
router.get("/technician/:technicianId", getTechnicianServices);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     tags: [Services]
 *     summary: Get service details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Service retrieved
 *       404:
 *         description: Service not found
 */
router.get("/:id", getServiceById);

/**
 * @swagger
 * /services:
 *   post:
 *     tags: [Services]
 *     summary: Create a new service (Technician only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [categoryId, title, price]
 *             properties:
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Service created
 *       403:
 *         description: Forbidden - must be a technician
 */
router.post(
  "/",
  authenticateToken,
  requireRole(["TECHNICIAN"]),
  validate(createServiceSchema),
  createService
);

export default router;
