import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDebounce } from "@/hooks/use-debounce";
import { Conversation } from "@/lib/types";
import { useRouter } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatRelativeTime } from "./utils";

type SearchDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

function SearchDialog({ isOpen, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [previousData, setPreviousData] = useState<Conversation[]>([]);
  const debouncedQuery = useDebounce(query, 500);
  const commandRef = useRef<HTMLDivElement>(null);

  const handleSelect = (conversationId: string) => {
    onOpenChange(false);
    setQuery("");
    router.navigate({
      to: "/chat/$conversationId",
      params: { conversationId },
    });
  };

  const results = useQuery(api.conversations.searchUserConversations, {
    query: debouncedQuery,
    paginationOpts: { numItems: 10, cursor: null },
  });

  const conversations = useMemo(() => {
    setPreviousData(results?.page ?? []);
    return results?.page;
  }, [results]);

  const dataToShow = useMemo(() => {
    if (conversations !== undefined) return conversations;
    return previousData;
  }, [conversations]);

  const isLoading = !conversations;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!isOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, onOpenChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim() === "") {
      const selectedItem = commandRef.current?.querySelector(
        '[data-selected="true"]',
      );
      if (selectedItem) {
        return;
      }
      e.preventDefault();
      onOpenChange(false);
      setQuery("");
      router.navigate({ to: "/chat" });
    }
  };

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      className="top-[30%] translate-y-0"
    >
      <Command
        ref={commandRef}
        shouldFilter={false}
        disablePointerSelection
        value={"-"}
      >
        <CommandInput
          placeholder="Search chats or press Enter to start a new chat..."
          value={query}
          onValueChange={setQuery}
          onKeyDown={handleKeyDown}
        />
        <CommandList className="relative">
          <CommandEmpty>No chats found.</CommandEmpty>
          {dataToShow.length > 0 && (
            <CommandGroup heading="Chats">
              {dataToShow.map((conversation) => (
                <CommandItem
                  key={conversation._id}
                  value={conversation._id}
                  onSelect={() => handleSelect(conversation._id)}
                  className="hover:bg-accent/80 h-9"
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <div className="truncate font-medium">
                        {conversation.title}
                      </div>
                    </div>
                    <div className="text-muted-foreground flex-shrink-0 text-xs">
                      {formatRelativeTime(conversation.createdAt)}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {isLoading && (
            <div className="bg-accent/20 absolute inset-0 flex h-full items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

export { SearchDialog };
