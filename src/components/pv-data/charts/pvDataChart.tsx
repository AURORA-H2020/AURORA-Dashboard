"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { usePathname, useRouter } from "@/i18n/routing";
import { useCreateQueryString } from "@/lib/hooks/useCreateQueryString";
import { useFormatter } from "next-intl";
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
  decimals = 0,
  useOnClick,
}: {
  chartData: any[];
  chartType: "bar" | "line";
  chartConfig: ChartConfig;
  xDataKey: string;
  unit?: string;
  decimals?: number;
  useOnClick?: { path: string; valueKey: string };
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const createQueryString = useCreateQueryString();
  const format = useFormatter();

  const ChartComponent = useMemo(
    () => (chartType === "bar" ? BarChart : LineChart),
    [chartType],
  );

  const tooltipFormatter = (value: any) => {
    if (typeof value !== "number") return value;
    return `${format.number(value, { maximumFractionDigits: decimals })}${unit ? ` ${unit}` : ""}`;
  };

  return (
    <ChartContainer config={chartConfig} className="min-h-[100px] w-full">
      <ChartComponent data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={xDataKey} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} unit={` ${unit}`} />
        <Tooltip
          content={<ChartTooltipContent formatter={tooltipFormatter} />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        {chartType === "bar" &&
          Object.keys(chartConfig).map((key) => (
            <Bar
              key={key}
              dataKey={key}
              radius={4}
              fill={chartConfig[key].color}
              cursor={useOnClick ? "pointer" : "default"}
              onClick={(data) => {
                if (!useOnClick) return;
                router.push(
                  pathname +
                    "?" +
                    createQueryString(
                      useOnClick.path,
                      data[useOnClick.valueKey],
                    ),
                );
              }}
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
