import { Request, Response, NextFunction } from "express";
import { logger } from "../services/logger.js";

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(err: ApiError, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  logger.error({
    error: message,
    code: err.code,
    stack: err.stack,
  });

  res.status(statusCode).json({
    error: message,
    code: err.code || "INTERNAL_ERROR",
    timestamp: new Date().toISOString(),
  });
}
