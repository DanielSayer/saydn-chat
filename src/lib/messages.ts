import type { UIMessage } from "@ai-sdk/react";

function groupReasoning(message: UIMessage): UIMessage {
  const groupedParts: UIMessage["parts"] = [];

  message.parts.forEach((part) => {
    if (part.type === "reasoning") {
      const last = groupedParts[groupedParts.length - 1];
      if (last && last.type === "reasoning" && last.state === part.state) {
        last.text = last.text + "\n\n" + part.text;
      } else {
        groupedParts.push({
          type: "reasoning",
          text: part.text,
          state: part.state,
        });
      }
    } else {
      groupedParts.push(part);
    }
  });

  return {
    ...message,
    parts: groupedParts,
  };
}

export { groupReasoning };
