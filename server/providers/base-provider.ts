import { ProcessRequest, ProcessResponse, ProviderConfig } from "./types.js";

export abstract class BaseProvider {
  protected config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  getName(): string {
    return this.config.name;
  }

  getVersion(): string {
    return this.config.version;
  }

  abstract process(request: ProcessRequest): Promise<ProcessResponse>;

  protected countTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }
}
