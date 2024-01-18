"use client";

import { LineChart } from "@tremor/react";
import { latestTemporalData } from "@/lib/transformData";
import { countriesMapping } from "@/lib/constants";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { useEffect, useState } from "react";
import { TimelineData } from "@/models/dashboard-data";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { DateRange } from "react-day-picker";

/**
 * Formats a number as a string with thousands separators and units for carbon dioxide.
 *
 * @param {number} number - The number to be formatted.
 * @return {string} The formatted number with the unit "kg CO₂".
 */
const dataFormatterCarbon = (number: number): string =>
    `${Intl.NumberFormat("us")
        .format(Math.round(number))
        .toString()} \n kg CO\u00B2`;

/**
 * Formats the given number as a string representing energy in kilowatt-hours.
 *
 * @param {number} number - The number to format.
 * @return {string} The formatted energy value as a string.
 */
const dataFormatterEnergy = (number: number): string =>
    `${Intl.NumberFormat("us").format(Math.round(number)).toString()} \n kWh`;

/**
 * Renders a line chart with tabs.
 *
 * @param {Object} props - The properties object.
 * @param {Summaries} props.localData - The local data.
 * @param {string[]} props.countries - The list of countries.
 * @param {"carbon" | "energy"} props.mode - The mode of the chart.
 * @param {"absolute" | "average"} props.calculationMode - The calculation mode.
 * @return {JSX.Element} The rendered line chart.
 */
export default function LineChartTabsV2({
    latestData,
    countries,
    categories,
    dateRange,
    mode,
    calculationMode,
}: {
    latestData: GlobalSummary;
    countries: string[];
    categories: ConsumptionCategory[];
    dateRange: DateRange | undefined;
    mode: "carbon" | "energy";
    calculationMode: "absolute" | "average";
}): JSX.Element {
    const [transformedData, setTransformedData] = useState<TimelineData[]>([]);

    useEffect(() => {
        const updatedTransformedData = latestTemporalData(
            latestData,
            mode,
            categories,
            dateRange,
            calculationMode,
        );
        setTransformedData(updatedTransformedData);
    }, [latestData, mode, categories, calculationMode, dateRange]);

    return (
        <LineChart
            className="h-80 mt-8"
            data={transformedData}
            index="Date"
            categories={countries}
            colors={countriesMapping.map((country) => country.color)}
            valueFormatter={
                mode == "carbon" ? dataFormatterCarbon : dataFormatterEnergy
            }
            showLegend={true}
            yAxisWidth={60}
        />
    );
}
