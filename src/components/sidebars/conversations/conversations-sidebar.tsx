import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

function ConversationsSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex w-full items-center">
        <Link to="/">saydn.chat</Link>
        <SidebarSeparator className="my-2" />
        <Link
          to="/"
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
      <SidebarContent></SidebarContent>
    </Sidebar>
  );
}

export { ConversationsSidebar };
