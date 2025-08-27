import { getUser } from "@/convex/lib/auth/get_user";
import { ChatError } from "@/lib/errors/chat-error";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { httpAction } from "../../_generated/server";

export const createChat = httpAction(async (ctx, req) => {
  const body: {
    messages: UIMessage[];
  } = await req.json();

  const user = await getUser(ctx.auth);
  if (!user) {
    throw new ChatError("unauthorized:chat").toResponse();
  }

  const result = streamText({
    model: openai("gpt-5-nano"),
    system: "You are a helpful assistant.",
    messages: convertToModelMessages(body.messages),
    onError: (error) => {
      console.error("Stream text error:", error);
    },
    providerOptions: {
      openai: {
        reasoningSummary: "auto",
      },
    },
  });

  return result.toUIMessageStreamResponse();
});
