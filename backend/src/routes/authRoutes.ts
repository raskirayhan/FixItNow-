import { Router } from "express";
import { register, login, getMe } from "../controllers/authController";
import { authenticateToken } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { registerSchema, loginSchema } from "../schemas/validation";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticateToken, getMe);

export default router;
