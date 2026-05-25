import { describe, it, expect } from "vitest";
import { TokenManager } from "./token-manager.js";

describe("TokenManager", () => {
  const manager = new TokenManager();
  const userId = "test-user";

  it("creates quota on first access", () => {
    const quota = manager.getOrCreateQuota(userId);
    expect(quota.usedTokens).toBe(0);
    expect(quota.maxTokens).toBeGreaterThan(0);
  });

  it("checks if tokens can be used", () => {
    manager.resetQuota(userId);
    const canUse = manager.canUseTokens(userId, 1000);
    expect(canUse).toBe(true);
  });

  it("tracks used tokens", () => {
    manager.resetQuota(userId);
    manager.useTokens(userId, 500);
    const remaining = manager.getRemainingTokens(userId);
    expect(remaining).toBeLessThan(1000000);
  });
});
