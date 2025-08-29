import { Header } from "@/components/header";
import { ConversationsSidebar } from "@/components/sidebars/conversations/conversations-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <ConversationsSidebar />
      <SidebarInset>
        <div className="grainy flex h-dvh flex-col rounded-sm antialiased md:h-[calc(100vh-1rem)]">
          <Header />
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
