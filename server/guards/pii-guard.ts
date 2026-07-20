export interface PIIDetectionResult {
  hasPII: boolean;
  detectedTypes: string[];
  confidence: number;
}

export class PIIGuard {
  private patterns: Record<string, RegExp> = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    phone: /(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/,
    ssn: /\d{3}-\d{2}-\d{4}/,
    creditCard: /\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/,
    ipAddress: /\b(?:\d{1,3}\.){3}\d{1,3}\b/,
  };

  detect(text: string): PIIDetectionResult {
    const detectedTypes: string[] = [];

    for (const [type, pattern] of Object.entries(this.patterns)) {
      if (pattern.test(text)) {
        detectedTypes.push(type);
      }
    }

    const hasPII = detectedTypes.length > 0;
    const confidence = hasPII ? 0.8 : 0;

    return {
      hasPII,
      detectedTypes,
      confidence,
    };
  }
}

export const piiGuard = new PIIGuard();
