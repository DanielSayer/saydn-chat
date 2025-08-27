import { v } from "convex/values";
import { MessagePart } from "./parts";

export const Message = v.object({
  conversationId: v.id("conversations"),
  messageId: v.string(),
  role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
  parts: v.array(MessagePart),
  createdAt: v.number(),
  updatedAt: v.number(),
  metadata: v.object({
    modelId: v.optional(v.string()),
    modelName: v.optional(v.string()),
    promptTokens: v.optional(v.number()),
    completionTokens: v.optional(v.number()),
    reasoningTokens: v.optional(v.number()),
    serverDurationMs: v.optional(v.number()),
  }),
});
