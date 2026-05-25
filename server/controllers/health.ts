import { Request, Response } from "express";

export async function getHealth(_req: Request, res: Response) {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
}
