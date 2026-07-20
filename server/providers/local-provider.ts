import { BaseProvider } from "./base-provider.js";
import { ProcessRequest, ProcessResponse } from "./types.js";

export class LocalProvider extends BaseProvider {
  constructor() {
    super({ name: "local", version: "1.0.0" });
  }

  async process(request: ProcessRequest): Promise<ProcessResponse> {
    const content = [
      "No external AI provider is configured yet.",
      "",
      `Your prompt was received successfully: ${request.prompt}`,
      "",
      "Configure a provider adapter in server/providers to replace this local response.",
    ].join("\n");

    return {
      content,
      tokensUsed: this.countTokens(content),
      model: "local-placeholder",
      provider: this.getName(),
    };
  }
}

export const localProvider = new LocalProvider();
