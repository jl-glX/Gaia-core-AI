import type { NextFunction, Request, Response } from "express";
import { logger } from "../services/logger.js";

export function isLoopbackAddress(address: string | undefined): boolean {
  if (!address) return false;

  const normalized = address.toLowerCase().replace(/^::ffff:/, "");
  return normalized === "::1" || normalized === "localhost" || normalized.startsWith("127.");
}

export function requireLocalAccess(req: Request, res: Response, next: NextFunction): void {
  if (isLoopbackAddress(req.socket.remoteAddress)) {
    next();
    return;
  }

  logger.warn({
    event: "remote_api_access_denied",
    method: req.method,
    path: req.path,
  });
  res.status(403).json({
    error: "Remote API access is disabled",
    code: "REMOTE_ACCESS_DISABLED",
  });
}
