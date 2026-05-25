import { describe, it, expect } from "vitest";
import { HtmlEscaper, MarkdownSanitizer } from "./sanitizers.js";

describe("HtmlEscaper", () => {
  const escaper = new HtmlEscaper();

  it("escapes HTML characters", () => {
    expect(escaper.escape("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;"
    );
  });

  it("escapes quotes", () => {
    expect(escaper.escape("Hello \"world\" & 'friends'")).toBe(
      "Hello &quot;world&quot; &amp; &#039;friends&#039;"
    );
  });

  it("unescapes HTML entities", () => {
    expect(escaper.unescape("&lt;div&gt;")).toBe("<div>");
  });
});

describe("MarkdownSanitizer", () => {
  const sanitizer = new MarkdownSanitizer();

  it("removes javascript: protocols", () => {
    const malicious = "[Click me](javascript:alert('xss'))";
    const sanitized = sanitizer.sanitize(malicious);
    expect(sanitized).not.toContain("javascript:");
  });

  it("removes event handlers", () => {
    const malicious = '<img src="x" onerror="alert(\'xss\')">';
    const sanitized = sanitizer.sanitize(malicious);
    expect(sanitized).not.toContain("onerror");
  });

  it("removes script tags", () => {
    const malicious = "<script>alert('xss')</script>";
    const sanitized = sanitizer.sanitize(malicious);
    expect(sanitized).not.toContain("<script");
  });
});
