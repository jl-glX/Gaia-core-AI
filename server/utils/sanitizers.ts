export class HtmlEscaper {
  private readonly escapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  escape(text: string): string {
    return text.replace(/[&<>"']/g, (char) => this.escapeMap[char]);
  }

  unescape(text: string): string {
    const unescapeMap: Record<string, string> = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#039;": "'",
    };

    return Object.entries(unescapeMap).reduce(
      (acc, [encoded, decoded]) => acc.replace(new RegExp(encoded, "g"), decoded),
      text
    );
  }
}

export class MarkdownSanitizer {
  private readonly dangerousPatterns = [
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers
    /<script/gi,
    /<iframe/gi,
    /<object/gi,
  ];

  sanitize(markdown: string): string {
    let sanitized = markdown;

    for (const pattern of this.dangerousPatterns) {
      sanitized = sanitized.replace(pattern, "");
    }

    return sanitized;
  }
}

export const htmlEscaper = new HtmlEscaper();
export const markdownSanitizer = new MarkdownSanitizer();
