import { ThemeProvider } from "@/components/themes/theme-provider";
import { ThemeScript } from "@/components/themes/theme-script";
import { Toaster } from "@/components/ui/sonner";
import globals_css from "@/styles/globals.css?url";
import type { QueryClient } from "@tanstack/react-query";
import {
  ClientOnly,
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: "saydn chat",
        },
      ],
      links: [{ rel: "stylesheet", href: globals_css }],
    }),
    component: RootComponent,
  },
);

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <HeadContent />
      </head>
      <body>
        <ClientOnly>
          <ThemeProvider>{children}</ThemeProvider>
        </ClientOnly>
        <Scripts />
        <Toaster />
      </body>
    </html>
  );
}
