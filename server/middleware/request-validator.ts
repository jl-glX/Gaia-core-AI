import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { logger } from "../services/logger.js";

export function validateRequest(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (typeof validated === "object" && validated !== null && "body" in validated) {
        req.body = (validated as Record<string, unknown>).body || req.body;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error({ validation_errors: error.flatten() });
        res.status(400).json({
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          details: error.flatten(),
        });
        return;
      }

      next(error);
    }
  };
}
