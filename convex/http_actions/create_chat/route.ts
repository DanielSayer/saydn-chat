import { ChatError } from "@/lib/errors/chat-error";
import { openai } from "@ai-sdk/openai";
import { getAuthUserId } from "@convex-dev/auth/server";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  smoothStream,
  streamText,
  type UIMessage,
} from "ai";
import { internal } from "../../_generated/api";
import { Id } from "../../_generated/dataModel";
import { httpAction } from "../../_generated/server";
import { convertToDbMessage } from "../../lib/convert_to_db_message";
import { generateTitle } from "./generate_title";

export const createChat = httpAction(async (ctx, req) => {
  const body: {
    conversationId?: string;
    responseId: string;
    messages: UIMessage[];
  } = await req.json();

  let conversationId = body.conversationId;
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ChatError("unauthorized:chat").toResponse();
  }

  if (!body.conversationId) {
    conversationId = await ctx.runMutation(
      internal.conversations.createConversation,
      {
        userId,
      },
    );
  }

  const { convexAssistantMessageId } = await ctx.runMutation(
    internal.messages.createMessage,
    {
      conversationId: conversationId as Id<"conversations">,
      responseId: body.responseId,
      message: convertToDbMessage(body.messages[body.messages.length - 1]),
    },
  );

  const streamStartedAt = Date.now();
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({
        type: "data-conversationId",
        data: conversationId,
        transient: true,
      });

      const modelMessages = convertToModelMessages(body.messages);
      if (modelMessages.length < 5) {
        generateTitle(
          ctx,
          conversationId as Id<"conversations">,
          modelMessages,
        );
      }

      const result = streamText({
        model: openai("gpt-5-nano"),
        system: "You are a helpful assistant.",
        experimental_transform: smoothStream(),
        messages: modelMessages,
        onError: (error) => {
          console.error("Stream text error:", error);
        },
        providerOptions: {
          openai: {
            reasoningSummary: "auto",
          },
        },
        onFinish: async ({ totalUsage, response }) => {
          await ctx.runMutation(internal.messages.updateMessage, {
            messageId: convexAssistantMessageId,
            parts: [],
            metadata: {
              inputTokens: totalUsage.inputTokens,
              outputTokens: totalUsage.outputTokens,
              reasoningTokens: totalUsage.reasoningTokens,
              modelId: response.modelId,
              serverDurationMs: Date.now() - streamStartedAt,
            },
          });
        },
      });

      writer.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
});
