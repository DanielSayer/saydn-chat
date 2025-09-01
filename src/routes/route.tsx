import { FeatureCard } from "@/components/landing-page/feature-card";
import { Footer } from "@/components/landing-page/footer";
import { Header } from "@/components/landing-page/header";
import { Hero } from "@/components/landing-page/hero";
import { ModelStrip } from "@/components/landing-page/models-strip";
import { QuickAsk } from "@/components/landing-page/quick-ask";
import { SignedOutCTA } from "@/components/landing-page/signed-out-cta";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createFileRoute } from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { Gauge, MessageSquare, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

const MODELS = ["GPT-4o", "Claude 3.5", "Llama 3", "Mistral"];

const EXAMPLES: string[] = [
  "Summarize this article into 5 bullet points.",
  "Compare Claude vs GPT for brainstorming ideas.",
  "Write a SQL query to get the top 10 customers by revenue.",
];

function RouteComponent() {
  const { isAuthenticated } = useConvexAuth();
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onQuickAsk = async (question: string) => {
    console.log(question);
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!question.trim() || !isAuthenticated) return;
    try {
      setSubmitting(true);
      await onQuickAsk(question.trim());
      setQuestion("");
    } finally {
      setSubmitting(false);
    }
  };

  const useExample = (text: string) => setQuestion(text);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="from-background via-background to-muted/30 dark:to-muted/20 min-h-dvh bg-gradient-to-b">
        <Header />

        <main className="mx-auto w-full max-w-5xl px-4 pt-10 pb-16 md:pt-14">
          <Hero />

          <section className="mx-auto mt-8 w-full max-w-2xl">
            {isAuthenticated ? (
              <QuickAsk
                value={question}
                onChange={setQuestion}
                onSubmit={handleSubmit}
                loading={submitting}
                examples={EXAMPLES}
                onUseExample={useExample}
              />
            ) : (
              <SignedOutCTA />
            )}
          </section>

          <section className="mt-12">
            <ModelStrip models={MODELS} />
          </section>

          <section className="mt-10 grid gap-3 md:grid-cols-3">
            <FeatureCard
              icon={MessageSquare}
              title="One chat, many models"
              body="Chat with multiple AI models in one place and compare answers
              side‑by‑side."
            />
            <FeatureCard
              icon={Gauge}
              title="Fast and focused"
              body="Minimal UI. Jump in, ask a question, and get results quickly."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Private by default"
              body="Your chats stay in your account. You control what is shared."
            />
          </section>
        </main>

        <Footer />
      </div>
    </TooltipProvider>
  );
}
