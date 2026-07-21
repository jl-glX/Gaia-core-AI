import { createHash, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { logger } from "../services/logger.js";

interface AccessEnvironment {
  ALLOW_REMOTE_ACCESS?: string;
  GAIA_API_TOKEN?: string;
}

export interface NetworkAccessDecision {
  allowed: boolean;
  status?: number;
  code?: "REMOTE_ACCESS_DISABLED" | "REMOTE_AUTH_NOT_CONFIGURED" | "INVALID_API_TOKEN";
}

export function isLoopbackAddress(address: string | undefined): boolean {
  if (!address) return false;

  const normalized = address.toLowerCase().replace(/^::ffff:/, "");
  return normalized === "::1" || normalized === "localhost" || normalized.startsWith("127.");
}

function tokensMatch(actual: string, expected: string): boolean {
  const actualDigest = createHash("sha256").update(actual).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(actualDigest, expectedDigest);
}

export function authorizeNetworkRequest(
  address: string | undefined,
  authorization: string | undefined,
  environment: AccessEnvironment = process.env
): NetworkAccessDecision {
  if (isLoopbackAddress(address)) return { allowed: true };

  if (environment.ALLOW_REMOTE_ACCESS !== "true") {
    return { allowed: false, status: 403, code: "REMOTE_ACCESS_DISABLED" };
  }

  const expectedToken = environment.GAIA_API_TOKEN?.trim();
  if (!expectedToken) {
    return { allowed: false, status: 503, code: "REMOTE_AUTH_NOT_CONFIGURED" };
  }

  const suppliedToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  if (!suppliedToken || !tokensMatch(suppliedToken, expectedToken)) {
    return { allowed: false, status: 401, code: "INVALID_API_TOKEN" };
  }

  return { allowed: true };
}

export function requireNetworkAccess(req: Request, res: Response, next: NextFunction): void {
  const decision = authorizeNetworkRequest(req.socket.remoteAddress, req.get("authorization"));
  if (decision.allowed) {
    next();
    return;
  }

  logger.warn({
    event: "remote_api_access_denied",
    method: req.method,
    path: req.path,
    reason: decision.code,
  });
  if (decision.status === 401) res.set("WWW-Authenticate", "Bearer");
  res.status(decision.status ?? 403).json({
    error: "Remote API access denied",
    code: decision.code,
  });
}
