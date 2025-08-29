import { ChatError } from "@/lib/errors/chat-error";
import type { StepResult, ToolSet } from "ai";
import { Infer } from "convex/values";
import type { MessagePart } from "../../schema/parts";

export function convertOutputToMessagePart(
  output: StepResult<ToolSet>["content"],
  reasoningDurations: number[],
): Infer<typeof MessagePart>[] {
  if (typeof output === "string") {
    return [{ type: "text", text: output }];
  }

  if (!Array.isArray(output)) {
    throw new ChatError("bad_request:api");
  }

  return output.map((part) => {
    if (part.type === "text") {
      return { type: "text", text: part.text };
    }

    if (part.type === "reasoning") {
      const duration = reasoningDurations.pop();

      if (!duration) {
        throw new ChatError("bad_request:api");
      }

      return {
        type: "reasoning",
        text: part.text,
        duration,
      };
    }

    if (part.type === "file") {
      return {
        type: "file",
        mediaType: part.file.mediaType,
        url: part.file.base64,
      };
    }

    if (part.type === "source") {
      if (part.sourceType === "document") {
        return {
          type: "source-document",
          sourceId: part.id,
          mediaType: part.mediaType,
          title: part.title,
          filename: part.filename,
        };
      }

      return {
        type: "source-url",
        sourceId: part.id,
        url: part.url,
        title: part.title,
      };
    }

    return {
      type: "error",
      error: {
        code: "Unsupported message part type",
        message: `Unsupported message part type: ${part.type}`,
      },
    };
  });
}
