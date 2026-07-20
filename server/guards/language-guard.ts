export interface LanguageValidationResult {
  valid: boolean;
  detectedLanguage?: string;
  reason?: string;
}

export class LanguageGuard {
  private allowedLanguages = ["en"];

  validate(text: string): LanguageValidationResult {
    // Simple heuristic: check for common non-ASCII patterns
    const hasNonAscii = Array.from(text).some((character) => (character.codePointAt(0) ?? 0) > 127);

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
