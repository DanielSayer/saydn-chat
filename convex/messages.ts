import { ChatError } from "@/lib/errors/chat-error";
import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
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

export const getMessagesByConversationId = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .order("asc")
      .collect();

    return messages.map((m) => ({
      id: m._id,
      role: m.role,
      parts: m.parts.map((p) => {
        if (p.type === "reasoning") {
          return {
            ...p,
            duration: Math.floor(p.duration / 1000),
          };
        }
        if (p.type === "error") {
          return { type: "data-error" as const, data: { ...p.error } };
        }
        return p;
      }),
    }));
  },
});
