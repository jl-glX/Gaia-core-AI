import { describe, it, expect } from "vitest";
import { PIIGuard } from "./pii-guard.js";

describe("PIIGuard", () => {
  const guard = new PIIGuard();

  it("detects email addresses", () => {
    const result = guard.detect("Contact me at john@example.com");
    expect(result.hasPII).toBe(true);
    expect(result.detectedTypes).toContain("email");
  });

  it("detects phone numbers", () => {
    const result = guard.detect("Call me at (555) 123-4567");
    expect(result.hasPII).toBe(true);
    expect(result.detectedTypes).toContain("phone");
  });

  it("returns false for clean text", () => {
    const result = guard.detect("This is a normal sentence with no PII");
    expect(result.hasPII).toBe(false);
    expect(result.detectedTypes.length).toBe(0);
  });
});
