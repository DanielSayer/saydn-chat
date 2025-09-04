import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useConvexAuth, useQuery } from "convex/react";
import {
  Loader2,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
  UserLock,
  Users,
} from "lucide-react";
import { GitHubIcon } from "../icons/github-icon";
import { api } from "../../../convex/_generated/api";

export function UserButton() {
  const queryClient = useQueryClient();
  const { signOut } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const currentUser = useQuery(api.me.get, isAuthenticated ? {} : "skip");

  if (isLoading) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-md">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button
        variant="outline"
        onClick={() => router.navigate({ to: "/auth/sign-in" })}
      >
        Sign In
      </Button>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    await queryClient.resetQueries({ queryKey: ["session"] });
    await queryClient.resetQueries({ queryKey: ["token"] });
    router.navigate({ to: "/" });
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.includes("_CACHE")) {
        localStorage.removeItem(key);
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="relative h-8 w-8 rounded-md">
          <Avatar className="h-8 w-8 rounded-md">
            <AvatarImage
              src={currentUser?.image || undefined}
              alt={currentUser?.name || "User"}
            />
            <AvatarFallback>
              {currentUser?.name ? (
                getInitials(currentUser?.name)
              ) : (
                <UserIcon className="h-4 w-4 rounded-md" />
              )}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">
              {currentUser?.name || "User"}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {currentUser?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.navigate({ to: "/settings" })}>
          <SettingsIcon className="h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.navigate({ to: "/about" })}>
          <Users className="h-4 w-4" />
          <span>About Us</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href="https://github.com/DanielSayer/saydn-chat"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.navigate({ to: "/privacy-policy" })}
        >
          <UserLock className="h-4 w-4" />
          <span>Privacy Policy</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon className="h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
