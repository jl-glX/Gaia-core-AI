import { Router } from "express";
import { getHealth } from "../controllers/health.js";
import { processPrompt } from "../controllers/process.js";
import { validateRequest } from "../middleware/request-validator.js";
import { promptSchema } from "../validators/schemas.js";

export const apiRouter = Router();

apiRouter.get("/health", getHealth);
apiRouter.post("/process", validateRequest(promptSchema), processPrompt);
