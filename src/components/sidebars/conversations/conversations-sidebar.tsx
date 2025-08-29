import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { groupConversationsByTimeBracket } from "@/lib/conversations";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { Loader2, PinIcon, Search } from "lucide-react";
import { useMemo } from "react";
import { ConversationGroup } from "./conversation-group";

function ConversationsSidebar() {
  const { results, loadMore, status } = usePaginatedQuery(
    api.conversations.getUserConversations,
    {},
    { initialNumItems: 50 },
  );

  const sentinelRef = useInfiniteScroll({
    hasMore: status === "CanLoadMore",
    isLoading: status === "LoadingMore" || status === "LoadingFirstPage",
    onLoadMore: () => loadMore(20),
  });

  const conversations = useMemo(() => {
    return groupConversationsByTimeBracket(results);
  }, [results]);

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex w-full items-center">
        <Link to="/" className="text-2xl font-medium tracking-tighter">
          saydn.chat
        </Link>
        <SidebarSeparator />
        <Link
          to="/chat"
          onClick={() => {
            document.dispatchEvent(new CustomEvent("new_chat"));
          }}
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full justify-center",
          )}
        >
          New Chat
        </Link>

        <Button variant="outline" className="w-full">
          <Search className="h-4 w-4" />
          Search chats
          <div className="ml-auto flex items-center gap-1 text-xs">
            <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono font-medium select-none">
              <span className="text-sm">⌘</span>
              <span className="text-xs">K</span>
            </kbd>
          </div>
        </Button>
      </SidebarHeader>
      <SidebarContent className="pb-6">
        <ConversationGroup
          title="Pinned"
          conversations={conversations.isPinned}
          icon={PinIcon}
        />
        <ConversationGroup title="Today" conversations={conversations.today} />
        <ConversationGroup
          title="Yesterday"
          conversations={conversations.yesterday}
        />
        <ConversationGroup
          title="This week"
          conversations={conversations.thisWeek}
        />
        <ConversationGroup
          title="This month"
          conversations={conversations.thisMonth}
        />
        <ConversationGroup title="Older" conversations={conversations.older} />
        <div ref={sentinelRef} />
        {(status === "LoadingMore" || status === "LoadingFirstPage") && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {status === "Exhausted" && (
          <p className="text-muted-foreground text-center text-sm">
            No more results
          </p>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

export { ConversationsSidebar };
