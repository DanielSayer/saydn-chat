import { ChatError } from "@/lib/errors/chat-error";
import type { UIMessage } from "ai";
import { Infer } from "convex/values";
import type { UIMessage as DB_UIMessage } from "../../schema/messages";

export function convertToDbMessage(
  message: UIMessage,
): Infer<typeof DB_UIMessage> {
  return {
    id: message.id,
    role: message.role,
    parts: message.parts.map((part) => {
      if (part.type === "text") {
        return {
          type: "text",
          text: part.text,
        };
      }

      if (part.type === "reasoning") {
        throw new ChatError("bad_request:chat");
      }

      if (part.type === "file") {
        return {
          type: "file",
          data: part.url,
          filename: part.filename,
          mediaType: part.mediaType,
        };
      }

      return {
        type: "error",
        error: {
          code: "Unsupported message part type",
          message: `Unsupported message part type: ${part.type}`,
        },
      };
    }),
  };
}
