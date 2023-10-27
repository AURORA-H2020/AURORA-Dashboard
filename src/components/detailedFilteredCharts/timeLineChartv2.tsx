"use client";

import { LineChart } from "@tremor/react";
import { latestTemporalData } from "@/lib/transformData";
import { Summaries } from "@/models/summary";
import { countryColors } from "@/lib/constants";

const dataFormatterCarbon = (number: number) =>
    `${Intl.NumberFormat("us")
        .format(Math.round(number))
        .toString()} \n kg CO\u00B2`;

const dataFormatterEnergy = (number: number) =>
    `${Intl.NumberFormat("us").format(Math.round(number)).toString()} \n kWh`;

export default function LineChartTabsV2({
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
    const transformedData = latestTemporalData(
        localData,
        mode,
        calculationMode,
    );

    return (
        <LineChart
            className="h-80 mt-8"
            data={transformedData!}
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