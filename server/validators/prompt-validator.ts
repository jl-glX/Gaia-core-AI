export interface PromptValidationResult {
  valid: boolean;
  errors: string[];
}

export class PromptValidator {
  validate(prompt: string): PromptValidationResult {
    const errors: string[] = [];

    if (!prompt || prompt.trim().length === 0) {
      errors.push("Prompt cannot be empty");
    }

    if (prompt.length > 10000) {
      errors.push("Prompt exceeds maximum length of 10000 characters");
    }

    if (prompt.length < 1) {
      errors.push("Prompt must contain at least 1 character");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const promptValidator = new PromptValidator();
