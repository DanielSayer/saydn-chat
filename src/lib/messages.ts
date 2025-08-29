import type { SaydnUIMessage } from "./types";

function groupReasoning(message: SaydnUIMessage): SaydnUIMessage {
  const groupedParts: SaydnUIMessage["parts"] = [];

  message.parts.forEach((part) => {
    if (part.type === "reasoning") {
      const last = groupedParts[groupedParts.length - 1];
      if (last && last.type === "reasoning" && last.state === part.state) {
        last.text = last.text + "\n\n" + part.text;
        last.duration = part.duration;
      } else {
        groupedParts.push({
          type: "reasoning",
          text: part.text,
          state: part.state,
          duration: part.duration,
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

function calculateTps(
  firstTokenAt: number,
  serverDurationMs: number,
  outputTokens: number,
) {
  const outputTime = serverDurationMs - firstTokenAt;
  return ((outputTokens * 1000) / outputTime).toFixed(2);
}

export { calculateTps, groupReasoning };
