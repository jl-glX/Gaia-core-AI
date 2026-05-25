export interface Chunk {
  content: string;
  index: number;
  startPosition: number;
  endPosition: number;
}

export class DocumentChunker {
  private readonly chunkSize: number;
  private readonly overlapSize: number;

  constructor(chunkSize: number = 1000, overlapSize: number = 100) {
    this.chunkSize = chunkSize;
    this.overlapSize = Math.min(overlapSize, chunkSize / 2);
  }

  chunk(document: string): Chunk[] {
    if (document.length === 0) {
      return [];
    }

    const chunks: Chunk[] = [];
    let position = 0;
    let index = 0;

    while (position < document.length) {
      const endPosition = Math.min(position + this.chunkSize, document.length);
      const content = document.substring(position, endPosition);

      chunks.push({
        content,
        index,
        startPosition: position,
        endPosition,
      });

      position += this.chunkSize - this.overlapSize;
      index++;
    }

    return chunks;
  }

  chunkByParagraph(document: string): Chunk[] {
    const paragraphs = document.split(/\n\n+/);
    const chunks: Chunk[] = [];
    let position = 0;
    let index = 0;

    for (const paragraph of paragraphs) {
      const startPosition = position;
      const endPosition = position + paragraph.length;

      chunks.push({
        content: paragraph.trim(),
        index,
        startPosition,
        endPosition,
      });

      position = endPosition + 2; // Account for \n\n
      index++;
    }

    return chunks;
  }
}

export const documentChunker = new DocumentChunker();
