import type { openai } from "@ai-sdk/openai";

type OpenAIResponsesModelId = Parameters<typeof openai>[0];

export const DEFAULT_MODEL: OpenAiModel = "gpt-5-nano-2025-08-07" as const;

export const models = {
  "gpt-5-nano-2025-08-07": "GPT-5 (nano)",
  "gpt-5-mini-2025-08-07": "GPT-5 (mini)",
  "gpt-5-2025-08-07": "GPT-5 (reasoning)",
  "gpt-5-chat-latest": "GPT-5",
  "gpt-4.1-nano-2025-04-14": "GPT-4.1 (nano)",
} as const satisfies Partial<Record<OpenAIResponsesModelId, string>>;

export type OpenAiModel = keyof typeof models;
