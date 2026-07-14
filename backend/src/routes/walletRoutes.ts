import { Router } from "express";
import { getWallet, addMoney, getTransactions } from "../controllers/walletController";
import { authenticateToken } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { addMoneySchema } from "../schemas/validation";

const router = Router();

/**
 * @swagger
 * /wallet:
 *   get:
 *     tags: [Wallet]
 *     summary: Get current user's wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet retrieved
 */
router.get("/", authenticateToken, getWallet);

/**
 * @swagger
 * /wallet/add:
 *   post:
 *     tags: [Wallet]
 *     summary: Add money to wallet
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Money added successfully
 *       400:
 *         description: Invalid amount
 */
router.post("/add", authenticateToken, validate(addMoneySchema), addMoney);

/**
 * @swagger
 * /wallet/transactions:
 *   get:
 *     tags: [Wallet]
 *     summary: Get wallet transaction history
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transactions retrieved
 */
router.get("/transactions", authenticateToken, getTransactions);

export default router;
