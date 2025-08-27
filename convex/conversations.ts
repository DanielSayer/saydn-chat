import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

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

export const updateConversationTitle = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.conversationId, { title: args.title });
  },
});
