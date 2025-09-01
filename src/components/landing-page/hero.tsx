import { Bot } from "lucide-react";

function Hero() {
  return (
    <section className="text-center">
      <div className="ring-border mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-emerald-500/15 ring-1">
        <Bot className="text-foreground/70 h-6 w-6" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
        Ask, compare, and get answers from multiple AI models
      </h1>
      <p className="text-muted-foreground mx-auto mt-3 max-w-[60ch] text-sm text-pretty md:text-base">
        saydn-chat is a minimal AI chat app that lets you talk to different
        models in one place. No clutter—just fast, helpful responses.
      </p>
    </section>
  );
}

export { Hero };
