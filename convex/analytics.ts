import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { models, OpenAiModel } from "@/lib/models";

const getDaysSinceEpoch = (daysAgo: number) =>
  Math.floor(Date.now() / (24 * 60 * 60 * 1000)) - daysAgo;

type ModelData = Record<
  string,
  {
    requests: number;
    tokens: number;
    inputTokens: number;
    outputTokens: number;
    reasoningTokens: number;
  }
>;

export const get = query({
  args: {
    timeframe: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const daysSinceEpoch = getDaysSinceEpoch(args.timeframe);
    const usage = await ctx.db
      .query("usage")
      .withIndex("by_user_day", (q) =>
        q.eq("userId", userId).gte("daysSinceEpoch", daysSinceEpoch),
      )
      .collect();

    const modelStats = Object.keys(models)
      .map((modelId) => {
        const modelEvents = usage.filter((u) => u.modelId === modelId);
        return {
          modelId: modelId,
          modelName: models[modelId as OpenAiModel],
          requests: modelEvents.length,
          inputTokens: modelEvents.reduce((sum, e) => sum + e.inputTokens, 0),
          outputTokens: modelEvents.reduce((sum, e) => sum + e.outputTokens, 0),
          reasoningTokens: modelEvents.reduce(
            (sum, e) => sum + e.reasoningTokens,
            0,
          ),
          totalTokens: modelEvents.reduce(
            (sum, e) =>
              sum + e.inputTokens + e.reasoningTokens + e.outputTokens,
            0,
          ),
        };
      })
      .filter((stat) => stat.requests > 0);

    return {
      modelStats,
      timeframe: args.timeframe,
      totalRequests: usage.length,
      totalTokens: usage.reduce(
        (acc, cur) =>
          acc + cur.inputTokens + cur.outputTokens + cur.reasoningTokens,
        0,
      ),
    };
  },
});

export const getChartData = query({
  args: {
    timeframe: v.number(),
  },
  handler: async (
    ctx,
    { timeframe },
  ): Promise<
    {
      daysSinceEpoch?: number;
      hoursSinceEpoch?: number;
      date: string;
      totalRequests: number;
      totalTokens: number;
      models: ModelData;
    }[]
  > => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // For 1d, we want hourly granularity
    if (timeframe === 1) {
      const hours = 24;
      const startTime = Date.now() - hours * 60 * 60 * 1000;

      const events = await ctx.db
        .query("usage")
        .withIndex("by_user_day", (q) => q.eq("userId", userId))
        .filter((q) => q.gte(q.field("_creationTime"), startTime))
        .collect();

      // Group by hour
      const chartData = [];
      for (let i = hours - 1; i >= 0; i--) {
        const hourStart = Date.now() - i * 60 * 60 * 1000;
        const hourEnd = Date.now() - (i - 1) * 60 * 60 * 1000;
        const hourEvents = events.filter(
          (e) => e._creationTime >= hourStart && e._creationTime < hourEnd,
        );

        const hourData = {
          hoursSinceEpoch: Math.floor(hourStart / (60 * 60 * 1000)),
          date: new Date(hourStart).toISOString(),
          totalRequests: hourEvents.length,
          totalTokens: hourEvents.reduce(
            (sum, e) =>
              sum + e.inputTokens + e.reasoningTokens + e.outputTokens,
            0,
          ),
          models: {} as ModelData,
        };

        Object.keys(models).forEach((modelId) => {
          const modelEvents = hourEvents.filter((e) => e.modelId === modelId);
          if (modelEvents.length > 0) {
            hourData.models[modelId] = {
              requests: modelEvents.length,
              tokens: modelEvents.reduce(
                (sum, e) =>
                  sum + e.inputTokens + e.reasoningTokens + e.outputTokens,
                0,
              ),
              inputTokens: modelEvents.reduce(
                (sum, e) => sum + e.inputTokens,
                0,
              ),
              outputTokens: modelEvents.reduce(
                (sum, e) => sum + e.outputTokens,
                0,
              ),
              reasoningTokens: modelEvents.reduce(
                (sum, e) => sum + e.reasoningTokens,
                0,
              ),
            };
          }
        });

        chartData.push(hourData);
      }

      return chartData;
    }

    const startDay = getDaysSinceEpoch(timeframe);

    // Get user's events in time range
    const events = await ctx.db
      .query("usage")
      .withIndex("by_user_day", (q) =>
        q.eq("userId", userId).gte("daysSinceEpoch", startDay),
      )
      .collect();

    // Group by day
    const chartData = [];
    for (let i = timeframe - 1; i >= 0; i--) {
      const daysSince = getDaysSinceEpoch(i);
      const dayEvents = events.filter((e) => e.daysSinceEpoch === daysSince);

      const dayData = {
        daysSinceEpoch: daysSince,
        date: new Date(daysSince * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        totalRequests: dayEvents.length,
        totalTokens: dayEvents.reduce(
          (sum, e) => sum + e.inputTokens + e.reasoningTokens + e.outputTokens,
          0,
        ),
        models: {} as ModelData,
      };

      // Post-filter by model for this day
      Object.keys(models).forEach((modelId) => {
        const modelEvents = dayEvents.filter((e) => e.modelId === modelId);
        if (modelEvents.length > 0) {
          dayData.models[modelId] = {
            requests: modelEvents.length,
            tokens: modelEvents.reduce(
              (sum, e) =>
                sum + e.inputTokens + e.reasoningTokens + e.outputTokens,
              0,
            ),
            inputTokens: modelEvents.reduce((sum, e) => sum + e.inputTokens, 0),
            outputTokens: modelEvents.reduce(
              (sum, e) => sum + e.outputTokens,
              0,
            ),
            reasoningTokens: modelEvents.reduce(
              (sum, e) => sum + e.reasoningTokens,
              0,
            ),
          };
        }
      });

      chartData.push(dayData);
    }

    return chartData;
  },
});
