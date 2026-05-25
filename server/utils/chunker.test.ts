import { describe, it, expect } from "vitest";
import { DocumentChunker } from "./chunker.js";

describe("DocumentChunker", () => {
  it("chunks document by size", () => {
    const chunker = new DocumentChunker(10, 2);
    const document = "a".repeat(25);
    const chunks = chunker.chunk(document);

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0].index).toBe(0);
  });

  it("chunks by paragraph", () => {
    const chunker = new DocumentChunker();
    const document = "Paragraph 1\n\nParagraph 2\n\nParagraph 3";
    const chunks = chunker.chunkByParagraph(document);

    expect(chunks.length).toBe(3);
    expect(chunks[0].content).toBe("Paragraph 1");
    expect(chunks[1].content).toBe("Paragraph 2");
  });

  it("handles empty document", () => {
    const chunker = new DocumentChunker();
    const chunks = chunker.chunk("");
    expect(chunks.length).toBe(0);
  });
});
