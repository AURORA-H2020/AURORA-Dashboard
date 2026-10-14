"use client";

import { useTranslations } from "next-intl";
import { CSSProperties, ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utilities";

type ValueFormatter = (value: number) => string;

const defaultValueFormatter: ValueFormatter = (value) => value.toString();

/**
 * Builds a chart config that assigns a colour to each category, cycling
 * through the colours if there are more categories than colours.
 */
const buildChartConfig = (
  categories: string[],
  colors: string[],
): ChartConfig =>
  Object.fromEntries(
    categories.map((category, index) => [
      category,
      { label: category, color: colors[index % colors.length] },
    ]),
  );

/**
 * Shown instead of a chart when there is no data to plot.
 */
const EmptyChart = ({ className }: { className?: string }): ReactNode => {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "flex h-40 w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground",
        className,
      )}
    >
      {t("error.noData")}
    </div>
  );
};

/**
 * Bar chart with one bar (or bar segment, if stacked) per category.
 *
 * @param props.data - The chart data, one entry per index value.
 * @param props.index - The data key used for the category axis.
 * @param props.categories - The data keys to draw as bars.
 * @param props.colors - The colours for the categories.
 * @param props.layout - "horizontal" for vertical bars, "vertical" for horizontal bars.
 * @param props.stacked - Whether to stack the categories.
 * @param props.relative - Whether to stack the categories to 100%.
 */
const CategoryBarChart = ({
  data,
  index,
  categories,
  colors,
  valueFormatter = defaultValueFormatter,
  layout = "horizontal",
  stacked = false,
  relative = false,
  yAxisWidth = 56,
  showLegend = true,
  className,
  style,
}: {
  data: object[];
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter?: ValueFormatter;
  layout?: "horizontal" | "vertical";
  stacked?: boolean;
  relative?: boolean;
  yAxisWidth?: number;
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
}): ReactNode => {
  if (data.length === 0) return <EmptyChart className={className} />;

  const chartConfig = buildChartConfig(categories, colors);
  const isVertical = layout === "vertical";
  const valueAxisFormatter = relative
    ? (value: number) => `${Math.round(value * 100)}%`
    : valueFormatter;

  // recharts only finds axes that are direct children, so no fragments here
  const valueAxisProps = {
    tickLine: false,
    axisLine: false,
    tickFormatter: valueAxisFormatter,
  };
  const categoryAxisProps = {
    dataKey: index,
    tickLine: false,
    axisLine: false,
  };

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("aspect-auto h-80 w-full", className)}
      style={style}
    >
      <BarChart
        data={data}
        layout={layout}
        stackOffset={relative ? "expand" : undefined}
        margin={{ left: 0, right: 8 }}
      >
        <CartesianGrid vertical={isVertical} horizontal={!isVertical} />
        {isVertical ? (
          <XAxis type="number" {...valueAxisProps} />
        ) : (
          <XAxis {...categoryAxisProps} />
        )}
        {isVertical ? (
          <YAxis type="category" width={yAxisWidth} {...categoryAxisProps} />
        ) : (
          <YAxis width={yAxisWidth} {...valueAxisProps} />
        )}
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => valueFormatter(Number(value))}
            />
          }
        />
        {showLegend && (
          <ChartLegend content={<ChartLegendContent className="flex-wrap" />} />
        )}
        {categories.map((category) => (
          <Bar
            key={category}
            dataKey={category}
            fill={chartConfig[category].color}
            stackId={stacked || relative ? "stack" : undefined}
            radius={stacked || relative ? 0 : 4}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
};

/**
 * Line chart with one line per category.
 *
 * @param props.data - The chart data, one entry per index value.
 * @param props.index - The data key used for the x axis.
 * @param props.categories - The data keys to draw as lines.
 * @param props.colors - The colours for the categories.
 */
const CategoryLineChart = ({
  data,
  index,
  categories,
  colors,
  valueFormatter = defaultValueFormatter,
  yAxisWidth = 56,
  showLegend = true,
  className,
}: {
  data: object[];
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter?: ValueFormatter;
  yAxisWidth?: number;
  showLegend?: boolean;
  className?: string;
}): ReactNode => {
  if (data.length === 0) return <EmptyChart className={className} />;

  const chartConfig = buildChartConfig(categories, colors);

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("aspect-auto h-80 w-full", className)}
    >
      <LineChart data={data} margin={{ left: 0, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={yAxisWidth}
          tickFormatter={valueFormatter}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => valueFormatter(Number(value))}
            />
          }
        />
        {showLegend && (
          <ChartLegend content={<ChartLegendContent className="flex-wrap" />} />
        )}
        {categories.map((category) => (
          <Line
            key={category}
            type="linear"
            dataKey={category}
            stroke={chartConfig[category].color}
            strokeWidth={2}
            // Show dots when there is a single point, which has no line
            dot={data.length === 1}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
};

/**
 * Pie chart with one slice per data entry and a legend below.
 *
 * @param props.data - The chart data, one entry per slice.
 * @param props.index - The data key used for the slice names.
 * @param props.category - The data key used for the slice values.
 * @param props.colors - The colours for the slices.
 */
const CategoryPieChart = ({
  data,
  index,
  category,
  colors,
  valueFormatter = defaultValueFormatter,
  className,
}: {
  data: object[];
  index: string;
  category: string;
  colors: string[];
  valueFormatter?: ValueFormatter;
  className?: string;
}): ReactNode => {
  if (data.length === 0) return <EmptyChart className={className} />;

  const names = data.map((entry) =>
    String((entry as Record<string, unknown>)[index]),
  );
  const chartConfig = buildChartConfig(names, colors);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <ChartContainer config={chartConfig} className="aspect-square h-48">
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                nameKey={index}
                formatter={(value) => valueFormatter(Number(value))}
              />
            }
          />
          <Pie
            data={data}
            dataKey={category}
            nameKey={index}
            strokeWidth={2}
            stroke="hsl(var(--background))"
          >
            {names.map((name) => (
              <Cell key={name} fill={chartConfig[name].color} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
        {names.map((name) => (
          <div key={name} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 shrink-0 rounded-[2px]"
              style={{ backgroundColor: chartConfig[name].color }}
            />
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Horizontal list of labelled bars, sorted by value and sized relative to
 * the largest value.
 *
 * @param props.data - The entries to show, each with a name, value and optional colour.
 */
const BarList = ({
  data,
  valueFormatter = defaultValueFormatter,
  className,
}: {
  data: { name: string; value: number; color?: string }[];
  valueFormatter?: ValueFormatter;
  className?: string;
}): ReactNode => {
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const maxValue = Math.max(...sortedData.map((entry) => entry.value), 0);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {sortedData.map((entry) => {
        const width =
          maxValue > 0 && entry.value > 0
            ? Math.max((entry.value / maxValue) * 100, 2)
            : 0;

        return (
          <div
            key={entry.name}
            className="flex items-center justify-between gap-6 text-sm"
          >
            <div className="relative flex h-8 flex-1 items-center">
              <div
                className="absolute inset-y-0 left-0 rounded opacity-40 transition-all"
                style={{
                  width: `${width}%`,
                  backgroundColor: entry.color ?? "hsl(var(--primary))",
                }}
              />
              <span className="relative truncate px-2">{entry.name}</span>
            </div>
            <span className="whitespace-nowrap tabular-nums">
              {valueFormatter(entry.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export { BarList, CategoryBarChart, CategoryLineChart, CategoryPieChart };
