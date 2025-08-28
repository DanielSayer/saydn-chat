import { v } from "convex/values";
import { MessagePart } from "./parts";

export const MessageMetadata = v.object({
  modelId: v.optional(v.string()),
  modelName: v.optional(v.string()),
  inputTokens: v.optional(v.number()),
  outputTokens: v.optional(v.number()),
  firstTokenAt: v.optional(v.number()),
  reasoningTokens: v.optional(v.number()),
  serverDurationMs: v.optional(v.number()),
});

export const Message = v.object({
  conversationId: v.id("conversations"),
  messageId: v.string(),
  role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
  parts: v.array(MessagePart),
  createdAt: v.number(),
  updatedAt: v.number(),
  metadata: MessageMetadata,
});

export const UIMessage = v.object({
  id: v.string(),
  role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
  parts: v.array(MessagePart),
});
