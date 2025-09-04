import { SignUp } from "@/components/auth/sign-up";
import { DotsLoader } from "@/components/loaders/dots-loader";
import { Button } from "@/components/ui/button";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export const Route = createLazyFileRoute("/auth/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const currentUser = useQuery(api.me.get, isAuthenticated ? {} : "skip");

  useEffect(() => {
    if (isLoading) return;
    if (!currentUser || currentUser.role === "owner") return;
    navigate({ to: "/" });
  }, [isAuthenticated, isLoading, currentUser]);

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left side - Background Image */}
      <div className="bg-accent hidden lg:block" />

      {/* Right side - Auth Content */}
      <div className="relative flex flex-col items-center justify-center gap-4 p-4 sm:p-6 md:p-8">
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
        </div>
        <div className="flex w-full max-w-sm items-center justify-center gap-4 sm:max-w-md lg:max-w-lg">
          {isLoading || !currentUser ? <DotsLoader /> : <SignUp />}
        </div>
      </div>
    </main>
  );
}
