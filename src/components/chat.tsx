import { useChat } from "@/hooks/use-chat";
import { useConvexAuth, useQuery } from "convex/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "./ai-elements/conversation";
import { ChatInput } from "./chat-input";
import { DotsLoader } from "./loaders/dots-loader";
import { Message } from "./message";
import { SignupMessagePrompt } from "./sign-up-message-prompt";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { SaydnUIMessage } from "@/lib/types";
import { getFirstName } from "@/lib/utils";
import { ChatEmptyState } from "./chat-empty-state";
import { useState } from "react";
import { toast } from "sonner";

type ChatProps = {
  conversationId: string | undefined;
  initialMessages: SaydnUIMessage[];
};

function ChatContent({ conversationId, initialMessages }: ChatProps) {
  const user = useQuery(api.me.get);
  const [input, setInput] = useState("");
  const { status, messages, sendMessage, stop, getResponseId } = useChat({
    conversationId,
    initialMessages,
  });

  const handleSetMessage = async (message: string) => {
    if (!input) {
      setInput(message);
    } else {
      await navigator.clipboard.writeText(message);
      toast.success("Copied to clipboard");
    }
  };

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
          conversationId,
          responseId: getResponseId(),
        },
      },
    );
  };

  return (
    <div className="relative size-full">
      <div className="flex h-full flex-col pb-4">
        {messages.length > 0 ? (
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
        ) : (
          <div className="flex flex-1 flex-col items-center">
            <ChatEmptyState
              name={getFirstName(user?.name)}
              onUseExample={handleSetMessage}
            />
          </div>
        )}
        <ChatInput
          status={status}
          onSubmit={onSubmit}
          input={input}
          setInput={setInput}
        />
      </div>
    </div>
  );
}

export function Chat({
  conversationId,
}: {
  conversationId: string | undefined;
}) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const shouldRequestData = isAuthenticated && !!conversationId && !isLoading;

  const messages = useQuery(
    api.messages.getMessagesByConversationId,
    shouldRequestData
      ? { conversationId: conversationId as Id<"conversations"> }
      : "skip",
  );

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

  if (!messages && !!conversationId) {
    return (
      <div className="relative flex h-[calc(100dvh-64px)] items-center justify-center">
        <DotsLoader />
      </div>
    );
  }

  return (
    <ChatContent
      conversationId={conversationId}
      initialMessages={messages ?? []}
    />
  );
}
