"use client";

import { LineChart } from "@tremor/react";
import { transformSummaryData } from "@/lib/transformData";
import { Summaries } from "@/models/summary";

const dataFormatterCarbon = (number: number) =>
    `${Intl.NumberFormat("us")
        .format(Math.round(number))
        .toString()} \n kg CO\u00B2`;

const dataFormatterEnergy = (number: number) =>
    `${Intl.NumberFormat("us").format(Math.round(number)).toString()} \n kWh`;

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

    console.log(countries);

    return (
        <LineChart
            className="h-80 mt-8"
            data={transformedData}
            index="Date"
            categories={countries}
            colors={["blue", "emerald", "yellow", "orange", "rose"]}
            valueFormatter={
                mode == "carbon" ? dataFormatterCarbon : dataFormatterEnergy
            }
            showLegend={true}
            yAxisWidth={60}
        />
    );
}
