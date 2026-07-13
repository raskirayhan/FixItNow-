import { Router } from "express";
import { getWallet, addMoney, getTransactions } from "../controllers/walletController";
import { authenticateToken } from "../middlewares/auth";

const router = Router();
router.get("/", authenticateToken, getWallet);
router.post("/add", authenticateToken, addMoney);
router.get("/transactions", authenticateToken, getTransactions);
export default router;
