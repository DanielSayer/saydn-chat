import type { TextStreamPart, ToolSet } from "ai";

export function makeDurationTransform<TOOLS extends ToolSet>(opts: {
  onStart: (info: { now: number }) => void;
  onDuration: (info: { durationMs: number }) => void;
}) {
  const { onStart, onDuration } = opts;
  const now = () =>
    typeof performance !== "undefined" && performance.now
      ? performance.now()
      : Date.now();

  const startStacks = new Map<string, number[]>();

  return new TransformStream<TextStreamPart<TOOLS>>({
    transform(chunk, controller) {
      try {
        if (chunk.type === "start-step") {
          onStart({ now: now() });
          controller.enqueue(chunk);
          return;
        }

        if (!chunk || typeof chunk.type !== "string") {
          controller.enqueue(chunk);
          return;
        }

        if (chunk.type === "reasoning-start") {
          const s = startStacks.get(chunk.id) ?? [];
          s.push(now());
          startStacks.set(chunk.id, s);
          controller.enqueue(chunk);
          return;
        }

        if (chunk.type === "reasoning-end") {
          const s = startStacks.get(chunk.id);
          const endT = now();
          let duration = 0;
          if (s && s.length) {
            const startT = s.pop()!;
            duration = endT - startT;
            if (s.length === 0) startStacks.delete(chunk.id);
          }

          onDuration({ durationMs: duration });

          controller.enqueue(chunk);
          return;
        }

        controller.enqueue(chunk);
      } catch (err) {
        controller.error(err);
      }
    },

    flush() {
      const t = now();
      for (const [id, stack] of startStacks.entries()) {
        while (stack.length) {
          const startT = stack.pop()!;
          const duration = t - startT;
          onDuration({ durationMs: duration });
        }
        startStacks.delete(id);
      }
    },
  });
}
