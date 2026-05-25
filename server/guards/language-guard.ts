export interface LanguageValidationResult {
  valid: boolean;
  detectedLanguage?: string;
  reason?: string;
}

export class LanguageGuard {
  private allowedLanguages = ["en"];

  validate(text: string): LanguageValidationResult {
    // Simple heuristic: check for common non-ASCII patterns
    const hasNonAscii = /[^\x00-\x7F]/.test(text);

    if (hasNonAscii) {
      return {
        valid: false,
        reason: "Non-ASCII content detected",
      };
    }

    return {
      valid: true,
      detectedLanguage: "en",
    };
  }

  setAllowedLanguages(languages: string[]): void {
    this.allowedLanguages = languages;
  }

  getAllowedLanguages(): string[] {
    return this.allowedLanguages;
  }
}

export const languageGuard = new LanguageGuard();
