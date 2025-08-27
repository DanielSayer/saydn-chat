import { ChatError } from "@/lib/errors/chat-error";
import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { MessageMetadata, UIMessage } from "./schema/messages";
import { MessagePart } from "./schema/parts";

export const createMessage = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    responseId: v.string(),
    message: UIMessage,
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new ChatError("not_found:chat");
    }

    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      role: args.message.role,
      messageId: args.message.id,
      parts: args.message.parts,
      metadata: {},
    });

    const assistantMessageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      role: "assistant",
      messageId: args.responseId,
      parts: [],
      metadata: {},
    });

    return {
      userMessageId: args.message.id,
      responseId: args.responseId,
      convexAssistantMessageId: assistantMessageId,
    };
  },
});

export const updateMessage = internalMutation({
  args: {
    messageId: v.id("messages"),
    parts: v.array(MessagePart),
    metadata: MessageMetadata,
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);

    if (!message) {
      throw new ChatError("not_found:chat");
    }

    await ctx.db.patch(args.messageId, {
      parts: args.parts,
      metadata: args.metadata,
    });
  },
});
