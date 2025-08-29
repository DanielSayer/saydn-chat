import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Conversation } from "@/lib/types";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { nanoid } from "nanoid";

type ConversationGroupProps = {
  title: string;
  conversations: Conversation[];
  icon?: LucideIcon;
};

function ConversationGroup({
  title,
  conversations,
  icon: Icon,
}: ConversationGroupProps) {
  if (conversations.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        {title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {conversations.map((conversation) => (
            <ConversationItem key={nanoid()} conversation={conversation} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function ConversationItem({ conversation }: { conversation: Conversation }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link
          to="/chat/$conversationId"
          params={{ conversationId: conversation.userId }}
          className="truncate"
        >
          {conversation.title}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export { ConversationGroup };
