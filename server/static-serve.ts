import path from "path";
import express from "express";

/**
 * Sets up static file serving for the Express app
 * @param app Express application instance
 */
export function setupStaticServing(app: express.Application) {
  const publicDirectory = path.join(process.cwd(), "dist", "public");

  app.use(express.static(publicDirectory));

  app.get("/{*splat}", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }
    res.sendFile(path.join(publicDirectory, "index.html"));
  });
}
