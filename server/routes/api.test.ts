import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../index.js";

describe("API routes", () => {
  it("reports a healthy server", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("healthy");
  });

  it("rejects an empty prompt", async () => {
    const response = await request(app).post("/api/process").send({ prompt: "" });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("VALIDATION_ERROR");
  });

  it("processes a prompt through the configured provider", async () => {
    const response = await request(app)
      .post("/api/process")
      .send({ prompt: "Explain the project structure", settings: { maxTokens: 200 } });

    expect(response.status).toBe(200);
    expect(response.body.provider).toBe("local");
    expect(response.body.model).toBe("local-placeholder");
    expect(response.body.content).toContain("Explain the project structure");
  });

  it("detects the same personal data on consecutive requests", async () => {
    const payload = { prompt: "Contact me at person@example.com" };

    const firstResponse = await request(app).post("/api/process").send(payload);
    const secondResponse = await request(app).post("/api/process").send(payload);

    expect(firstResponse.body.warnings).toEqual(["Potential personal data detected: email"]);
    expect(secondResponse.body.warnings).toEqual(firstResponse.body.warnings);
  });
});
