import { Chat } from "@/components/chat";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_chat/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Chat />;
}
