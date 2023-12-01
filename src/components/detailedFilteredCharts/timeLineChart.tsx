"use client";

import { LineChart } from "@tremor/react";
import { transformSummaryData } from "@/lib/transformData";
import { Summaries } from "@/models/summary";
import { countryColors } from "@/lib/constants";

/**
 * Formats a given number as a string with comma separators and appends a unit of measurement.
 *
 * @param {number} number - The number to format.
 * @return {string} The formatted string with comma separators and the unit of measurement "kg CO₂".
 */
const dataFormatterCarbon = (number: number) =>
    `${Intl.NumberFormat("us")
        .format(Math.round(number))
        .toString()} \n kg CO\u00B2`;

/**
 * Formats a number as a string with US number formatting and appends " kWh".
 *
 * @param {number} number - The number to be formatted.
 * @return {string} The formatted number with " kWh" appended.
 */
const dataFormatterEnergy = (number: number) =>
    `${Intl.NumberFormat("us").format(Math.round(number)).toString()} \n kWh`;

/**
 * Renders a line chart with tabs.
 *
 * @param {Object} props - The props object.
 * @param {Summaries} props.localData - The local data object.
 * @param {string[]} props.countries - The array of countries.
 * @param {"carbon" | "energy"} props.mode - The mode for the line chart.
 * @param {"absolute" | "average"} props.calculationMode - The calculation mode.
 * @return {JSX.Element} - The rendered line chart component.
 */
export default function LineChartTabs({
    localData,
    countries,
    mode,
    calculationMode,
}: {
    localData: Summaries;
    countries: string[];
    mode: "carbon" | "energy";
    calculationMode: "absolute" | "average";
}) {
    const transformedData = transformSummaryData(
        localData,
        mode,
        calculationMode,
    );

    return (
        <LineChart
            className="h-80 mt-8"
            data={transformedData}
            index="Date"
            categories={countries}
            colors={countryColors}
            valueFormatter={
                mode == "carbon" ? dataFormatterCarbon : dataFormatterEnergy
            }
            showLegend={true}
            yAxisWidth={60}
        />
    );
}
