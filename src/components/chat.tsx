import { useChat } from "@/hooks/use-chat";
import { useConvexAuth } from "convex/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "./ai-elements/conversation";
import { ChatInput } from "./chat-input";
import { DotsLoader } from "./loaders/dots-loader";
import { Message } from "./message";
import { SignupMessagePrompt } from "./sign-up-message-prompt";

type ChatProps = {
  conversationId: string | undefined;
};

function ChatContent({ conversationId }: ChatProps) {
  const { status, messages, sendMessage, stop, getResponseId } = useChat({
    conversationId,
  });

  const onSubmit = (input: string) => {
    if (status === "streaming") {
      stop();
      return;
    }

    if (status === "submitted") {
      return;
    }

    if (!input || !input.trim()) {
      return;
    }

    sendMessage(
      { text: input },
      {
        body: {
          responseId: getResponseId(),
        },
      },
    );
  };

  return (
    <div className="relative size-full">
      <div className="flex h-full flex-col pb-4">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            <div className="mx-auto max-w-4xl">
              {status === "submitted" && <DotsLoader />}
            </div>
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <ChatInput status={status} onSubmit={onSubmit} />
      </div>
    </div>
  );
}

export function Chat({ conversationId }: ChatProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="relative flex h-[calc(100dvh-64px)] items-center justify-center">
        <DotsLoader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative flex h-[calc(100dvh-64px)] items-center justify-center">
        <SignupMessagePrompt />
      </div>
    );
  }

  return <ChatContent conversationId={conversationId} />;
}
