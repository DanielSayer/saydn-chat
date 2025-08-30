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
import { DEFAULT_MODEL, models, type OpenAiModel } from "@/lib/models";
import { getSystemPrompt } from "../../lib/prompts";

export const createChat = httpAction(async (ctx, req) => {
  const startAt = Date.now();
  const body: {
    conversationId?: string;
    responseId: string;
    modelId: OpenAiModel;
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

  const selectedModel: OpenAiModel =
    body.modelId in models ? body.modelId : DEFAULT_MODEL;

  const streamStartedAt = Date.now();
  const reasoningDurations: number[] = [];
  let firstTokenAt: number | null = null;
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({
        type: "data-conversationId",
        data: conversationId,
        transient: true,
      });

      writer.write({
        type: "data-modelId",
        data: selectedModel,
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
        model: openai(selectedModel),
        system: getSystemPrompt(models[selectedModel]),
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
              modelName: models[selectedModel],
              inputTokens: totalUsage.inputTokens,
              outputTokens: totalUsage.outputTokens,
              reasoningTokens: totalUsage.reasoningTokens,
              serverDurationMs: Date.now() - streamStartedAt,
              firstTokenAt: firstTokenAt ? firstTokenAt - startAt : undefined,
            },
          });

          await ctx.runMutation(internal.conversations.markAsUpdated, {
            conversationId: conversationId as Id<"conversations">,
          });
        },
      });

      writer.merge(
        result.toUIMessageStream({
          messageMetadata: ({ part }) => {
            if (part.type === "finish") {
              return {
                modelId: selectedModel,
                modelName: models[selectedModel],
                inputTokens: part.totalUsage.inputTokens,
                outputTokens: part.totalUsage.outputTokens,
                reasoningTokens: part.totalUsage.reasoningTokens,
                serverDurationMs: Date.now() - streamStartedAt,
                firstTokenAt: firstTokenAt ? firstTokenAt - startAt : undefined,
              };
            }
          },
        }),
      );
    },
  });

  return createUIMessageStreamResponse({ stream });
});
