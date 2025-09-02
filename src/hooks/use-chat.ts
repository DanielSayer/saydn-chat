import { env } from "@/env/client";
import { useChatStore } from "@/lib/chat-store";
import type { OpenAiModel } from "@/lib/models";
import type { SaydnUIMessage } from "@/lib/types";
import { useChat as useAiChat } from "@ai-sdk/react";
import { useAuthToken } from "@convex-dev/auth/react";
import { DefaultChatTransport } from "ai";
import { nanoid } from "nanoid";
import { useRef } from "react";

const convexSiteUrl = env.VITE_CONVEX_URL.replace(/.cloud$/, ".site");

type UseChatProps = {
  conversationId?: string;
  initialMessages: SaydnUIMessage[];
};

export const useChat = ({ conversationId, initialMessages }: UseChatProps) => {
  const token = useAuthToken();
  const seededNextId = useRef<string | null>(null);
  const { setConversationId, modelId, setModelId } = useChatStore();

  const getResponseId = () => {
    const nextId = nanoid();
    seededNextId.current = nextId;
    return nextId;
  };

  const chat = useAiChat<SaydnUIMessage>({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: `${convexSiteUrl}/api/chat`,
      headers: { Authorization: `Bearer ${token}` },
    }),
    generateId: () => {
      if (!seededNextId.current) {
        return nanoid();
      }
      const id = seededNextId.current;
      seededNextId.current = null;
      return id;
    },
    onData: (message) => {
      if (message.type === "data-conversationId") {
        if (
          !conversationId &&
          message.data &&
          typeof message.data === "string"
        ) {
          setConversationId(message.data);
        }
      }
      if (message.type === "data-modelId") {
        if (!modelId && message.data && typeof message.data === "string") {
          setModelId(message.data as OpenAiModel);
        }
      }
    },
  });

  return {
    ...chat,
    getResponseId,
  };
};
