import { v } from "convex/values";

export const Usage = v.object({
  userId: v.string(),
  modelId: v.string(),
  modelName: v.string(),
  inputTokens: v.number(),
  outputTokens: v.number(),
  reasoningTokens: v.number(),
  daysSinceEpoch: v.number(), // Math.floor(Date.now() / (24*60*60*1000))
});
