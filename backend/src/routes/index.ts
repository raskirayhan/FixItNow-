import { Router } from "express";
import authRoutes from "./authRoutes";
import serviceRoutes from "./serviceRoutes";
import bookingRoutes from "./bookingRoutes";
import paymentRoutes from "./paymentRoutes";
import reviewRoutes from "./reviewRoutes";
import adminRoutes from "./adminRoutes";
import profileRoutes from "./profileRoutes";
import walletRoutes from "./walletRoutes";
import notificationRoutes from "./notificationRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/services", serviceRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);
router.use("/reviews", reviewRoutes);
router.use("/admin", adminRoutes);
router.use("/profile", profileRoutes);
router.use("/wallet", walletRoutes);
router.use("/notifications", notificationRoutes);

export default router;
