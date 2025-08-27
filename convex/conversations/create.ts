import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

export const createConversation = internalMutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("conversations", {
      userId: args.userId,
      title: "New chat",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const createMessage = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system"),
      v.literal("tool"),
    ),
    tokens: v.optional(v.number()),
    modelId: v.optional(v.string()),
    text: v.string(),
    reasoning: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const message = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      role: "assistant",
      messageId: "1",
      parts: [],
      metadata: {},
    });

    return message;
  },
});
