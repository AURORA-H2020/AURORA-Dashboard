"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useCreateQueryString } from "@/lib/hooks/useCreateQueryString";
import { usePathname, useRouter } from "@/navigation";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PvDataChart = ({
  chartData,
  chartType,
  chartConfig,
  xDataKey,
  unit,
}: {
  chartData: any[];
  chartType: "bar" | "line";
  chartConfig: ChartConfig;
  xDataKey: string;
  unit?: string;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const createQueryString = useCreateQueryString();

  const ChartComponent = useMemo(
    () => (chartType === "bar" ? BarChart : LineChart),
    [chartType],
  );

  const tooltipFormatter = (value: any) => {
    if (typeof value !== "number") return value;
    return `${Math.floor(value)}${unit ? ` ${unit}` : ""}`;
  };

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ChartComponent data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={xDataKey} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} unit={"kWh"} />
        <Tooltip
          content={<ChartTooltipContent formatter={tooltipFormatter} />}
        />
        {chartType === "bar" &&
          Object.keys(chartConfig).map((key) => (
            <Bar
              key={key}
              dataKey={key}
              radius={4}
              fill={chartConfig[key].color}
              cursor={"pointer"}
              onClick={(data) =>
                router.push(
                  pathname + "?" + createQueryString("date", data[xDataKey]),
                )
              }
            />
          ))}
        {chartType === "line" &&
          Object.keys(chartConfig).map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              dot={false}
              strokeWidth={2}
              stroke={chartConfig[key].color}
            />
          ))}
      </ChartComponent>
    </ChartContainer>
  );
};

export { PvDataChart };
