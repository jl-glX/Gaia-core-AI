import { z } from "zod";

export const promptSchema = z.object({
  body: z.object({
    prompt: z.string().min(1, "Prompt cannot be empty").max(10000, "Prompt too long"),
    settings: z
      .object({
        temperature: z.number().min(0).max(2).optional().default(0.7),
        maxTokens: z.number().min(1).max(32000).optional().default(2000),
      })
      .optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const settingsSchema = z.object({
  body: z.object({
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().min(1).max(32000).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
