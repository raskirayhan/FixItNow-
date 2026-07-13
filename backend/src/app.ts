import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();

const app = express();

app.use(helmet());
app.use(morgan("combined"));
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use((req, res, next) => {
  if (req.originalUrl === "/api/payments/webhook") {
    express.raw({ type: "application/json" })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "FixItNow API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", routes);

app.use(errorHandler);

export default app;
