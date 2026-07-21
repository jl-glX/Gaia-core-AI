import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { Server } from "http";
import { pathToFileURL } from "url";
import { apiRouter } from "./routes/api.js";
import { errorHandler } from "./middleware/error-handler.js";
import { apiLimiter } from "./middleware/rate-limiter.js";
import { requireNetworkAccess } from "./middleware/network-access.js";
import { logger } from "./services/logger.js";
import { setupStaticServing } from "./static-serve.js";

dotenv.config();

export const app = express();

app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : process.env.CLIENT_ORIGIN || "http://localhost:3000",
  })
);

// Body parsing middleware
const requestLimit = process.env.MAX_REQUEST_SIZE || "10kb";
app.use(express.json({ limit: requestLimit }));
app.use(express.urlencoded({ extended: true, limit: requestLimit }));

// Logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info({
    method: req.method,
    path: req.path,
  });
  next();
});

// Keep the AI API local by default, even if the listening host is misconfigured.
app.use("/api/", requireNetworkAccess, apiLimiter);

// API routes
app.use("/api", apiRouter);

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

if (process.env.NODE_ENV === "production") {
  setupStaticServing(app);
}

// Error handler (must be last)
app.use(errorHandler);

// Export a function to start the server
export function startServer(
  port: string | number,
  host = process.env.HOST || "127.0.0.1"
): Promise<Server> {
  return new Promise((resolve, reject) => {
    const numericPort = typeof port === "string" ? Number.parseInt(port, 10) : port;
    const server = app.listen(numericPort, host, () => {
      logger.info({ message: `API server running on http://${host}:${port}` });
      resolve(server);
    });
    server.on("error", reject);
  });
}

// Start the server directly if this is the main module
const entrypoint = process.argv[1];
if (entrypoint && import.meta.url === pathToFileURL(entrypoint).href) {
  logger.info({ message: "Starting server..." });
  startServer(process.env.PORT || 3001).catch((error) => {
    logger.error({ error: "Failed to start server", details: error });
    process.exit(1);
  });
}
