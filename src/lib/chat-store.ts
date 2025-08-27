import { nanoid } from "nanoid";
import { create } from "zustand";

type ChatState = {
  conversationId: string | undefined;
  rerenderTrigger: string;
  lastProcessedDataIndex: number;
  shouldUpdateQuery: boolean;
  skipNextDataCheck: boolean;
  attachedStreamIds: Record<string, string>;
  pendingStreams: Record<string, boolean>;
  targetFromMessageId: string | undefined;
  targetMode: "normal" | "edit" | "retry";
};

type ChatActions = {
  setConversationId: (conversationId: string | undefined) => void;
  setLastProcessedDataIndex: (index: number) => void;
  setShouldUpdateQuery: (should: boolean) => void;
  setSkipNextDataCheck: (skip: boolean) => void;
  resetChat: () => void;
  triggerRerender: () => void;
  setAttachedStreamId: (conversationId: string, streamId: string) => void;
  setPendingStream: (conversationId: string, pending: boolean) => void;
  setTargetFromMessageId: (messageId: string | undefined) => void;
  setTargetMode: (mode: "normal" | "edit" | "retry") => void;
  setRerenderTrigger: (rerenderTrigger: string) => void;
};

const initialState: ChatState = {
  conversationId: undefined,
  rerenderTrigger: nanoid(),
  lastProcessedDataIndex: -1,
  shouldUpdateQuery: false,
  skipNextDataCheck: true,
  attachedStreamIds: {},
  pendingStreams: {},
  targetFromMessageId: undefined,
  targetMode: "normal",
};

export const useChatStore = create<ChatState & ChatActions>((set) => ({
  ...initialState,

  setConversationId: (conversationId) => set({ conversationId }),

  setLastProcessedDataIndex: (lastProcessedDataIndex) =>
    set({ lastProcessedDataIndex }),
  setShouldUpdateQuery: (shouldUpdateQuery) => set({ shouldUpdateQuery }),
  setSkipNextDataCheck: (skipNextDataCheck) => set({ skipNextDataCheck }),
  setRerenderTrigger: (rerenderTrigger) => set({ rerenderTrigger }),
  resetChat: () => {
    set({
      ...initialState,
      rerenderTrigger: nanoid(),
      attachedStreamIds: {},
      targetFromMessageId: undefined,
      lastProcessedDataIndex: -1,
      skipNextDataCheck: true,
      targetMode: "normal",
      conversationId: undefined,
    });
  },

  triggerRerender: () => {
    set({ rerenderTrigger: nanoid() });
  },

  setAttachedStreamId: (threadId, streamId) => {
    if (!threadId) return;
    set((state) => ({
      attachedStreamIds: {
        ...state.attachedStreamIds,
        [threadId]: streamId,
      },
    }));
  },

  setPendingStream: (threadId, pending) => {
    if (!threadId) return;
    set((state) => ({
      pendingStreams: {
        ...state.pendingStreams,
        [threadId]: pending,
      },
    }));
  },

  setTargetFromMessageId: (messageId) =>
    set({ targetFromMessageId: messageId }),

  setTargetMode: (mode) => set({ targetMode: mode }),
}));
