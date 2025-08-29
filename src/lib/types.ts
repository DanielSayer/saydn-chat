import type { ReasoningUIPart, UIMessage, UIMessagePart, UITools } from "ai";
import type { Conversation } from "convex/schema/conversations";
import type { MessageMetadata } from "convex/schema/messages";
import type { Infer } from "convex/values";

export type Conversation = Infer<typeof Conversation> & {
  _id: string;
};

type SaydnDataTypes = {
  error: {
    code: string;
    message: string;
  };
  conversationId: string;
};

type AddDurationToReasoning<P> = P extends ReasoningUIPart
  ? P & { duration: number }
  : P;

type ExtendedUIMessagePart<TOOLS extends UITools = UITools> =
  AddDurationToReasoning<UIMessagePart<SaydnDataTypes, TOOLS>>;

export type SaydnUIMessage = Omit<
  UIMessage<Infer<typeof MessageMetadata>>,
  "parts"
> & {
  parts: ExtendedUIMessagePart[];
};
