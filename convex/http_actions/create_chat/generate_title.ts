import { openai } from "@ai-sdk/openai";
import { generateText, ModelMessage } from "ai";
import type { GenericActionCtx } from "convex/server";
import type { DataModel, Id } from "../../_generated/dataModel";
import { internal } from "../../_generated/api";

export const generateTitle = async (
  ctx: GenericActionCtx<DataModel>,
  conversationId: Id<"conversations">,
  messages: ModelMessage[],
) => {
  const relevantMessages = messages
    .filter((message) => message.role !== "system")
    .filter((message) => message.role !== "tool")
    .slice(0, 5);

  const result = await generateText({
    model: openai("gpt-4.1-nano"),
    messages: [
      {
        role: "system",
        content: `
You are tasked with generating a concise, descriptive title for a chat conversation based on the initial messages. The title should:

1. Be 2-6 words long
2. Capture the main topic or question being discussed
3. Be clear and specific
4. Use title case (capitalize first letter of each major word)
5. Not include quotation marks or special characters
6. Be professional and appropriate

Examples of good titles:
- "Python Data Analysis Help"
- "React Component Design"
- "Travel Planning Italy"
- "Budget Spreadsheet Formula"
- "Career Change Advice"

Generate a title that accurately represents what this conversation is about based on the messages provided.`,
      },
      {
        role: "user",
        content: `Here are the first 5 messages of the conversation:

${relevantMessages.map((message) => `${message.role}: ${contentToText(message.content)}`).join("\n")}

Generate a title that accurately represents what this conversation is about based on the messages provided.`,
      },
    ],
  });

  await ctx.runMutation(internal.conversations.updateConversationTitle, {
    title: result.text,
    conversationId,
  });
};

const contentToText = (content: ModelMessage["content"]): string => {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (part.type === "text") {
          return part.text;
        }
        if (part.type === "image") {
          return "[image]";
        }
        if (part.type === "file") {
          return `[file: ${part.filename || "unknown"}]`;
        }
        if (part.type === "tool-call") {
          return `[tool: ${part.toolName}]`;
        }
        if (part.type === "tool-result") {
          return `[tool result: ${part.toolName}]`;
        }
        if (part.type === "reasoning") {
          return `[reasoning: ${part.text}]`;
        }
        return "";
      })
      .join(" ");
  }

  return "";
};
