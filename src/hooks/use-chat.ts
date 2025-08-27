import { env } from "@/env/client";
import { useChatStore } from "@/lib/chat-store";
import { useChat as useAiChat } from "@ai-sdk/react";
import { useAuthToken } from "@convex-dev/auth/react";
import { DefaultChatTransport } from "ai";
import { nanoid } from "nanoid";
import { useRef } from "react";

const convexSiteUrl = env.VITE_CONVEX_URL.replace(/.cloud$/, ".site");

type UseChatProps = {
  conversationId?: string;
};

export const useChat = ({ conversationId }: UseChatProps) => {
  const token = useAuthToken();
  const seededNextId = useRef<string | null>(null);
  const { rerenderTrigger } = useChatStore();

  const getResponseId = () => {
    const nextId = nanoid();
    seededNextId.current = nextId;
    return nextId;
  };

  const chat = useAiChat({
    id: conversationId ?? rerenderTrigger,
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
  });

  return {
    ...chat,
    getResponseId,
  };
};
