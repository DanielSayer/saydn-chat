import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { MODEL_COLORS } from "@/lib/colors";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { Activity, Zap, BarChart3, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

type Timeframe = 1 | 7 | 30;

const tokenChartConfig = {
  input: {
    label: "Input Tokens",
  },
  output: {
    label: "Output Tokens",
  },
  reasoning: {
    label: "Reasoning Tokens",
  },
} satisfies ChartConfig;

export const Route = createFileRoute("/settings/usage")({
  component: RouteComponent,
});

function RouteComponent() {
  const [timeframe, setTimeframe] = useState<Timeframe>(7);
  const isMobile = useIsMobile();
  const data = useQuery(api.analytics.get, { timeframe });
  const chartData = useQuery(api.analytics.getChartData, { timeframe });

  // Process data for stacked model usage chart
  const modelUsageData = useMemo(() => {
    if (!chartData) return [];

    return chartData.map((day) => {
      const dayData = {
        date: day.date,
        total: day.totalTokens,
      };

      // Add each model's token count
      Object.entries(day.models).forEach(([modelId, data]) => {
        dayData[modelId] = data.tokens;
      });

      return dayData;
    });
  }, [chartData]);

  // Process data for token type distribution chart
  const tokenTypeData = useMemo(() => {
    if (!chartData) return [];

    return chartData.map((day) => ({
      date: day.date,
      input: Object.values(day.models).reduce(
        (sum, model) => sum + model.inputTokens,
        0,
      ),
      output: Object.values(day.models).reduce(
        (sum, model) => sum + model.outputTokens,
        0,
      ),
      reasoning: Object.values(day.models).reduce(
        (sum, model) => sum + model.reasoningTokens,
        0,
      ),
    }));
  }, [chartData]);

  // Get unique models for chart config
  const modelIds = useMemo(() => {
    if (!data) return [];
    return data.modelStats.map((model) => model.modelId);
  }, [data]);

  // Create chart configs
  const modelChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    modelIds.forEach((modelId, index) => {
      config[modelId] = {
        label:
          data?.modelStats.find((m) => m.modelId === modelId)?.modelName ||
          modelId,
        color: MODEL_COLORS[index % MODEL_COLORS.length],
      };
    });
    return config;
  }, [modelIds, data]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={`${timeframe}`}
          onValueChange={(value) => setTimeframe(Number(value) as Timeframe)}
        >
          <TabsList className="grid w-full grid-cols-3 sm:w-auto">
            <TabsTrigger value="1">1 Day</TabsTrigger>
            <TabsTrigger value="7">7 Days</TabsTrigger>
            <TabsTrigger value="30">30 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card className="gap-3 p-4">
          <CardHeader className="flex flex-row items-center px-0">
            <Activity className="text-muted-foreground size-3 sm:size-4" />
            <CardTitle className="text-xs font-medium sm:text-sm">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-lg font-bold sm:text-2xl">
              {data?.totalRequests || 0}
            </div>
            <p className="text-muted-foreground text-xs">
              {timeframe === 1 ? "today" : `last ${timeframe} days`}
            </p>
          </CardContent>
        </Card>

        <Card className="gap-3 p-4">
          <CardHeader className="flex flex-row items-center px-0">
            <Zap className="text-muted-foreground size-3 sm:size-4" />
            <CardTitle className="text-xs font-medium sm:text-sm">
              Total Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-lg font-bold sm:text-2xl">
              {((data?.totalTokens || 0) / 1000).toFixed(1)}K
            </div>
            <p className="text-muted-foreground text-xs">
              input + output + reasoning
            </p>
          </CardContent>
        </Card>

        <Card className="gap-3 p-4">
          <CardHeader className="flex flex-row items-center px-0">
            <BarChart3 className="text-muted-foreground size-3 sm:size-4" />
            <CardTitle className="text-xs font-medium sm:text-sm">
              Models Used
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-lg font-bold sm:text-2xl">
              {data?.modelStats.length || 0}
            </div>
            <p className="text-muted-foreground text-xs">different models</p>
          </CardContent>
        </Card>

        <Card className="gap-3 p-4">
          <CardHeader className="flex flex-row items-center px-0">
            <TrendingUp className="text-muted-foreground size-3 sm:size-4" />
            <CardTitle className="text-xs font-medium sm:text-sm">
              Avg tokens/request
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-lg font-bold sm:text-2xl">
              {data?.totalRequests
                ? Math.round((data?.totalTokens || 0) / data.totalRequests)
                : 0}
            </div>
            <p className="text-muted-foreground text-xs">
              total tokens / total requests
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {/* Stacked Model Usage Chart */}
        <Card className="gap-3 overflow-hidden p-4">
          <CardHeader className="gap-0 px-0 pb-3">
            <CardTitle className="text-base sm:text-lg">
              Token Usage by Model
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Daily token consumption breakdown by model
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 px-0">
            <ChartContainer
              config={modelChartConfig}
              className="aspect-auto h-[250px] w-full overflow-hidden sm:h-[300px]"
            >
              <BarChart
                data={modelUsageData}
                width={undefined}
                height={undefined}
                margin={{ left: 0, right: 10, top: 5, bottom: 0 }}
              >
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    if (timeframe === 1) {
                      return date.toLocaleTimeString([], {
                        hour: "numeric",
                        hour12: true,
                      });
                    }
                    return isMobile
                      ? `${date.getMonth() + 1}/${date.getDate()}`
                      : date.toLocaleDateString();
                  }}
                  fontSize={isMobile ? 10 : 12}
                />
                <YAxis
                  width={30}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  fontSize={isMobile ? 10 : 12}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    if (timeframe === 1) {
                      return date.toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      });
                    }
                    return date.toLocaleDateString([], {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  formatter={(value, name) => [
                    `${Number(value).toLocaleString()} tokens - `,
                    modelChartConfig[name as string]?.label || name,
                  ]}
                />
                {modelIds.map((modelId) => (
                  <Bar
                    key={modelId}
                    dataKey={modelId}
                    stackId="models"
                    fill={modelChartConfig[modelId]?.color}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Token Type Distribution Chart */}
        <Card className="gap-3 overflow-hidden p-4">
          <CardHeader className="gap-0 px-0 pb-3">
            <CardTitle className="text-base sm:text-lg">
              Token Type Distribution
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Input, output, and reasoning token breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 px-0">
            <ChartContainer
              config={tokenChartConfig}
              className="aspect-auto h-[250px] w-full overflow-hidden sm:h-[300px]"
            >
              <BarChart
                data={tokenTypeData}
                margin={{ left: 0, right: 10, top: 5, bottom: 0 }}
                width={undefined}
                height={undefined}
              >
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    if (timeframe === 1) {
                      return date.toLocaleTimeString([], {
                        hour: "numeric",
                        hour12: true,
                      });
                    }
                    return isMobile
                      ? `${date.getMonth() + 1}/${date.getDate()}`
                      : date.toLocaleDateString();
                  }}
                  fontSize={isMobile ? 10 : 12}
                />
                <YAxis
                  width={30}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  fontSize={isMobile ? 10 : 12}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    if (timeframe === 1) {
                      return date.toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      });
                    }
                    return date.toLocaleDateString([], {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  formatter={(value, name) => [
                    `${Number(value).toLocaleString()} `,
                    tokenChartConfig[name as keyof typeof tokenChartConfig]
                      ?.label || name,
                  ]}
                />
                <Bar dataKey="input" stackId="tokens" fill={"var(--chart-1)"} />
                <Bar
                  dataKey="output"
                  stackId="tokens"
                  fill={"var(--chart-2)"}
                />
                <Bar
                  dataKey="reasoning"
                  stackId="tokens"
                  fill={"var(--chart-3)"}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="gap-3 p-4">
        <CardHeader className="gap-0 px-0">
          <CardTitle className="text-base sm:text-lg">
            Model Usage Details
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Detailed breakdown by model for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-0">
          <div className="space-y-1.5">
            {data?.modelStats.map((model, index) => (
              <div
                key={model.modelId}
                className="flex items-center justify-between rounded-lg border px-2 py-1"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor:
                        MODEL_COLORS[index % MODEL_COLORS.length],
                    }}
                  />
                  <div>
                    <div className="text-sm font-medium">{model.modelName}</div>
                    <div className="text-muted-foreground text-xs">
                      {model.requests} request
                      {model.requests === 1 ? "" : "s"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium sm:text-base">
                    {(model.totalTokens / 1000).toFixed(1)}K tokens
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {(model.inputTokens / 1000).toFixed(0)}K in •{" "}
                    {(model.outputTokens / 1000).toFixed(0)}K out
                    {model.reasoningTokens > 0 &&
                      ` • ${(model.reasoningTokens / 1000).toFixed(0)}K reasoning`}
                  </div>
                </div>
              </div>
            ))}
            {(!data?.modelStats || data.modelStats.length === 0) && (
              <div className="text-muted-foreground py-8 text-center">
                No usage data for the selected period
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
