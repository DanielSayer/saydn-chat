import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConvexAuth } from "convex/react";

function Header() {
  const { isAuthenticated } = useConvexAuth();
  return (
    <header className="bg-background/80 sticky top-0 z-20 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <a
          href="/"
          className="group flex items-center gap-2 font-semibold tracking-tight"
        >
          <div
            className={cn(
              "relative flex h-8 w-8 items-center justify-center rounded-xl",
              "bg-gradient-to-br from-violet-500/15 to-emerald-500/15",
              "ring-border ring-1",
            )}
          >
            <Sparkles className="text-foreground/80 h-4 w-4" />
            <div
              className={cn(
                "pointer-events-none absolute -inset-4 -z-10",
                "bg-[radial-gradient(circle_at_center,theme(colors.violet.500/10),transparent_60%)]",
                "blur-2xl",
              )}
            />
          </div>
          <span className="text-sm">saydn-chat</span>
        </a>

        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button asChild>
              <Link to="/chat">
                Open app
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/auth/sign-in">
                Sign in
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

export { Header };
