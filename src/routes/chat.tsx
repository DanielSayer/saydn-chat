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
        <div className="grainy flex flex-1 flex-col rounded-sm antialiased">
          <Header />
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
