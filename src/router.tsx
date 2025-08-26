import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { ConvexProviderWithAuth } from "convex/react";
import type { ReactNode } from "react";
import { routeTree } from "./routeTree.gen";
import { useBetterAuth } from "./hooks/use-better-auth";
import { QueryClient } from "@tanstack/react-query";
import { env } from "./env/client";
import { ConvexQueryClient } from "@convex-dev/react-query";

export function createRouter() {
  const convexQueryClient = new ConvexQueryClient(env.VITE_CONVEX_URL);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  });
  convexQueryClient.connect(queryClient);

  const router = routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      defaultPreload: "intent",
      context: { queryClient },
      defaultNotFoundComponent: () => (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
          <div className="space-y-2">
            <h1 className="text-muted-foreground text-8xl font-bold">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground max-w-md">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
          </div>
          <a
            href="/"
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Go Home
          </a>
        </div>
      ),
      Wrap: ({ children }: { children: ReactNode }) => (
        <ConvexProviderWithAuth
          client={convexQueryClient.convexClient}
          useAuth={useBetterAuth}
        >
          {children}
        </ConvexProviderWithAuth>
      ),
    }),
    queryClient,
  );

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
