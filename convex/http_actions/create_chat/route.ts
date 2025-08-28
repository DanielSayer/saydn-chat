import { ChatError } from "@/lib/errors/chat-error";
import { openai } from "@ai-sdk/openai";
import { getAuthUserId } from "@convex-dev/auth/server";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai";
import { internal } from "../../_generated/api";
import { Id } from "../../_generated/dataModel";
import { httpAction } from "../../_generated/server";
import { convertOutputToMessagePart } from "../../lib/transformers/convert_stream_output_to_message_parts";
import { convertToDbMessage } from "../../lib/transformers/convert_ui_message_to_db_message";
import { generateTitle } from "./generate_title";
import { makeDurationTransform } from "./stream_transform";

export const createChat = httpAction(async (ctx, req) => {
  const startAt = Date.now();
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
  const reasoningDurations: number[] = [];
  let firstTokenAt: number | null = null;
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({
        type: "data-conversationId",
        data: conversationId,
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
        experimental_transform: () => {
          return makeDurationTransform({
            onStart: ({ now }) => {
              firstTokenAt = now;
            },
            onDuration: ({ durationMs }) => {
              reasoningDurations.push(durationMs);
            },
          });
        },
        messages: modelMessages,
        onError: (error) => {
          console.error("Stream text error:", error);
        },
        providerOptions: {
          openai: {
            reasoningSummary: "auto",
          },
        },
        onFinish: async ({ totalUsage, response, content }) => {
          const parts = convertOutputToMessagePart(content, reasoningDurations);

          await ctx.runMutation(internal.messages.updateMessage, {
            messageId: convexAssistantMessageId,
            parts: parts,
            metadata: {
              modelId: response.modelId,
              inputTokens: totalUsage.inputTokens,
              outputTokens: totalUsage.outputTokens,
              reasoningTokens: totalUsage.reasoningTokens,
              serverDurationMs: Date.now() - streamStartedAt,
              firstTokenAt: firstTokenAt ? firstTokenAt - startAt : undefined,
            },
          });
        },
      });

      writer.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
});
