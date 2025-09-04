import { AnimatedGradientText } from "@/components/animated-gradient-text";
import { AnimatedGridPattern } from "@/components/animated-grid-pattern";
import { PlaceholdersAndVanishInput } from "@/components/placeholders-and-vanish-input";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const [input, setInput] = useState("");
  const handleSubmit = () => {
    if (!input.trim()) return;
    navigate({
      to: "/chat",
      search: { prompt: input },
    });
  };

  return (
    <div className="bg-background relative flex min-h-screen w-full flex-col items-center justify-center gap-8 overflow-hidden rounded-lg p-20">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-75%] h-[200%] skew-y-12",
        )}
      />
      <div className="group relative mx-auto flex items-center justify-center rounded-full bg-neutral-100/80 px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] dark:bg-neutral-800/80">
        <span
          className={cn(
            "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]",
          )}
          style={{
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "subtract",
            WebkitClipPath: "padding-box",
          }}
        />
        🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
        <AnimatedGradientText className="text-sm font-medium">
          saydn chat is now live!
        </AnimatedGradientText>
        <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </div>

      <div className="mb-20 text-center">
        <h1 className="text-6xl font-bold tracking-tighter">saydn chat</h1>
        <p className="text-lg tracking-tight">
          A fast, clean AI chat that gets out of your way.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Label htmlFor="quick-start">Quick start</Label>
        <PlaceholdersAndVanishInput
          id="quick-start"
          placeholders={[
            "How many R's in strawberry?",
            "What is the meaning of life?",
            "Are black holes real?",
          ]}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={handleSubmit}
        />
      </div>
      <div className="flex items-center gap-1">
        <Separator className="!w-8" />
        <span className="text-muted-foreground">OR</span>
        <Separator className="!w-8" />
      </div>
      <div className="relative mx-auto h-12 w-full max-w-sm px-5">
        <Link
          to="/chat"
          className={buttonVariants({ className: "h-12 w-full !rounded-full" })}
        >
          Go to chat
        </Link>
      </div>
    </div>
  );
}
