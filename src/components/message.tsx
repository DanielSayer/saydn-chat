import { groupReasoning } from "@/lib/messages";
import type { UIMessage } from "@ai-sdk/react";
import { Actions } from "./ai-elements/actions";
import {
  MessageContent,
  Message as MessagePrimitive,
} from "./ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "./ai-elements/reasoning";
import { Response } from "./ai-elements/response";
import { CopyButton } from "./buttons/copy-button";

function Message(props: { message: UIMessage }) {
  return (
    <MessagePrimitive
      from={props.message.role}
      className="group mx-auto max-w-4xl"
    >
      <div className="flex flex-col gap-0.5">
        <MessageContent>
          {groupReasoning(props.message).parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return (
                  <Response key={`${props.message.id}-${i}`}>
                    {part.text}
                  </Response>
                );
              case "reasoning":
                if (part.state === "done" && !part.text) {
                  return null;
                }
                return (
                  <Reasoning
                    key={`${props.message.id}-${i}`}
                    className="w-full"
                    isStreaming={part.state === "streaming"}
                  >
                    <ReasoningTrigger />
                    <ReasoningContent>{part.text}</ReasoningContent>
                  </Reasoning>
                );
              default:
                return null;
            }
          })}
        </MessageContent>
        {props.message.parts.some(
          (p) => "state" in p && p.state === "streaming",
        ) ? null : (
          <Actions className="flex w-full opacity-0 transition-all duration-100 group-hover:opacity-100 group-[.is-user]:flex-row-reverse">
            <CopyButton
              variant="ghost"
              aria-label="Copy message"
              content={
                props.message.parts.find((part) => part.type === "text")?.text
              }
            />
          </Actions>
        )}
      </div>
    </MessagePrimitive>
  );
}

export { Message };
