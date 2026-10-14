"use client";

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
 * Renders a tooltip row with a colour indicator, the category name and the
 * formatted value.
 */
const tooltipRow =
  (valueFormatter: ValueFormatter) =>
  (
    value: unknown,
    name: unknown,
    item: { color?: string; payload?: { fill?: string } },
  ): ReactNode => (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center gap-1.5">
        <div
          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
          style={{ backgroundColor: item.color ?? item.payload?.fill }}
        />
        <span className="text-muted-foreground">{String(name)}</span>
      </div>
      <span className="font-mono font-medium tabular-nums text-foreground">
        {valueFormatter(Number(value))}
      </span>
    </div>
  );

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
  const chartConfig = buildChartConfig(categories, colors);
  const isVertical = layout === "vertical";
  const axisValueFormatter = relative
    ? (value: number) => `${Math.round(value * 100)}%`
    : valueFormatter;

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
          <>
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={axisValueFormatter}
            />
            <YAxis
              type="category"
              dataKey={index}
              tickLine={false}
              axisLine={false}
              width={yAxisWidth}
            />
          </>
        ) : (
          <>
            <XAxis dataKey={index} tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={yAxisWidth}
              tickFormatter={axisValueFormatter}
            />
          </>
        )}
        <ChartTooltip
          content={
            <ChartTooltipContent formatter={tooltipRow(valueFormatter)} />
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
  const chartConfig = buildChartConfig(categories, colors);

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("aspect-auto h-80 w-full", className)}
    >
      <LineChart data={data} margin={{ left: 0, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={index} tickLine={false} axisLine={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={yAxisWidth}
          tickFormatter={valueFormatter}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent formatter={tooltipRow(valueFormatter)} />
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
            dot={false}
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
  const names = data.map((entry) =>
    String((entry as Record<string, unknown>)[index]),
  );
  const chartConfig = buildChartConfig(names, colors);

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("aspect-auto h-64 w-full", className)}
    >
      <PieChart>
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              nameKey={index}
              formatter={tooltipRow(valueFormatter)}
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
        <ChartLegend
          content={<ChartLegendContent nameKey={index} className="flex-wrap" />}
        />
      </PieChart>
    </ChartContainer>
  );
};

/**
 * Horizontal list of labelled bars, sized relative to the largest value.
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
  const maxValue = Math.max(...data.map((entry) => entry.value), 0);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {data.map((entry) => (
        <div
          key={entry.name}
          className="flex items-center justify-between gap-6 text-sm"
        >
          <div className="relative flex h-8 flex-1 items-center">
            <div
              className="absolute inset-y-0 left-0 rounded opacity-40 transition-all"
              style={{
                width: `${maxValue > 0 ? (entry.value / maxValue) * 100 : 0}%`,
                backgroundColor: entry.color ?? "hsl(var(--primary))",
              }}
            />
            <span className="relative truncate px-2">{entry.name}</span>
          </div>
          <span className="whitespace-nowrap tabular-nums">
            {valueFormatter(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export { BarList, CategoryBarChart, CategoryLineChart, CategoryPieChart };
