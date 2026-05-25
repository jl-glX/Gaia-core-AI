import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { pathToFileURL } from "url";
import { apiRouter } from "./routes/api.js";
import { errorHandler } from "./middleware/error-handler.js";
import { apiLimiter } from "./middleware/rate-limiter.js";
import { logger } from "./services/logger.js";

dotenv.config();

const app = express();

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info({
    method: req.method,
    path: req.path,
  });
  next();
});

// API rate limiting
app.use("/api/", apiLimiter);

// API routes
app.use("/api", apiRouter);

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Export a function to start the server
export async function startServer(port: string | number) {
  try {
    if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  logger.info({ message: "Starting server..." });
  startServer(process.env.PORT || 3001);
}

    app.listen(port, () => {
      logger.info({ message: `API Server running on port ${port}` });
    });
  } catch (err) {
    logger.error({ error: "Failed to start server", details: err });
    process.exit(1);
  }
}

// Start the server directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  logger.info({ message: "Starting server..." });
  startServer(process.env.PORT || 3001);
}
