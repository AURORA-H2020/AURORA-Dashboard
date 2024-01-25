"use client";

import { LineChart } from "@tremor/react";
import { temporalData } from "@/lib/transformData";
import { countriesMapping } from "@/lib/constants";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { useEffect, useState } from "react";
import {
    CalculationMode,
    EnergyMode,
    TimelineData,
} from "@/models/dashboard-data";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { DateRange } from "react-day-picker";
import { valueFormatterCarbon, valueFormatterEnergy } from "@/lib/utilities";

/**
 * Renders a consumption timeline chart based on the provided data.
 *
 * @param {GlobalSummary} globalSummaryData - The global summary data.
 * @param {string[]} countries - The list of countries.
 * @param {ConsumptionCategory[]} categories - The list of consumption categories.
 * @param {DateRange | undefined} dateRange - The date range.
 * @param {EnergyMode} mode - The energy mode.
 * @param {CalculationMode} calculationMode - The calculation mode.
 * @return {JSX.Element} The rendered consumption timeline chart.
 */
export function ConsumptionTimelineChart({
    globalSummaryData,
    countries,
    categories,
    dateRange,
    mode,
    calculationMode,
}: {
    globalSummaryData: GlobalSummary;
    countries: string[];
    categories: ConsumptionCategory[];
    dateRange: DateRange | undefined;
    mode: EnergyMode;
    calculationMode: CalculationMode;
}): JSX.Element {
    const [transformedData, setTransformedData] = useState<TimelineData[]>([]);

    useEffect(() => {
        const updatedTemporalData = temporalData(
            globalSummaryData,
            mode,
            categories,
            dateRange,
            calculationMode,
        );
        setTransformedData(updatedTemporalData);
    }, [globalSummaryData, mode, categories, calculationMode, dateRange]);

    return (
        <LineChart
            className="h-80 mt-8"
            data={transformedData}
            index="Date"
            categories={countries}
            colors={countriesMapping.map((country) => country.color)}
            valueFormatter={
                mode == "carbon" ? valueFormatterCarbon : valueFormatterEnergy
            }
            showLegend={true}
            yAxisWidth={60}
        />
    );
}
