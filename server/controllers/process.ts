import { Request, Response } from "express";
import { piiGuard } from "../guards/pii-guard.js";
import { tokenManager } from "../guards/token-manager.js";
import { localProvider } from "../providers/local-provider.js";

export async function processPrompt(req: Request, res: Response) {
  const { prompt, settings } = req.body;
  const userId = req.ip || "anonymous";
  const estimatedTokens = Math.ceil(prompt.length / 4);

  if (!tokenManager.canUseTokens(userId, estimatedTokens)) {
    res.status(429).json({
      error: "Token quota exceeded",
      code: "TOKEN_QUOTA_EXCEEDED",
    });
    return;
  }

  const piiResult = piiGuard.detect(prompt);
  const response = await localProvider.process({ prompt, settings });

  tokenManager.useTokens(userId, response.tokensUsed);

  if (piiResult.hasPII) {
    response.warnings = [`Potential personal data detected: ${piiResult.detectedTypes.join(", ")}`];
  }

  res.json(response);
}
