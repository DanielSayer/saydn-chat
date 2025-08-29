import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChatStore } from "@/lib/chat-store";
import type { Conversation } from "@/lib/types";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

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
            <ConversationItem
              key={conversation._id}
              conversation={conversation}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function ConversationItem({ conversation }: { conversation: Conversation }) {
  const { conversationId } = useChatStore();

  return (
    <SidebarMenuItem>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <SidebarMenuButton
            asChild
            isActive={conversation._id === conversationId}
          >
            <Link
              to="/chat/$conversationId"
              params={{ conversationId: conversation._id }}
              className="truncate"
            >
              <span>{conversation.title}</span>
            </Link>
          </SidebarMenuButton>
        </TooltipTrigger>
        <TooltipContent side="top">{conversation.title}</TooltipContent>
      </Tooltip>
    </SidebarMenuItem>
  );
}

export { ConversationGroup };
