import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
  errorDetails?: Record<string, unknown>;
}

const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[ERROR] ${statusCode}: ${message}`);
  if (statusCode === 500) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails: err.errorDetails || {},
  });
};

export default errorHandler;
