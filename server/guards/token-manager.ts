interface TokenQuota {
  maxTokens: number;
  usedTokens: number;
  resetTime: Date;
}

export class TokenManager {
  private quotas: Map<string, TokenQuota> = new Map();

  private readonly DEFAULT_QUOTA = 1000000;
  private readonly RESET_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

  getOrCreateQuota(userId: string): TokenQuota {
    const existing = this.quotas.get(userId);

    if (existing && new Date() < existing.resetTime) {
      return existing;
    }

    const quota: TokenQuota = {
      maxTokens: this.DEFAULT_QUOTA,
      usedTokens: 0,
      resetTime: new Date(Date.now() + this.RESET_INTERVAL_MS),
    };

    this.quotas.set(userId, quota);
    return quota;
  }

  canUseTokens(userId: string, tokensNeeded: number): boolean {
    const quota = this.getOrCreateQuota(userId);
    return quota.usedTokens + tokensNeeded <= quota.maxTokens;
  }

  useTokens(userId: string, tokensUsed: number): void {
    const quota = this.getOrCreateQuota(userId);
    quota.usedTokens += tokensUsed;
  }

  getRemainingTokens(userId: string): number {
    const quota = this.getOrCreateQuota(userId);
    return quota.maxTokens - quota.usedTokens;
  }

  resetQuota(userId: string): void {
    this.quotas.delete(userId);
  }
}

export const tokenManager = new TokenManager();
