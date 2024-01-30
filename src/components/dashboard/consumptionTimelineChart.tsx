"use client";

import { countriesMapping } from "@/lib/constants";
import { temporalData } from "@/lib/transformData";
import {
    getYearsInSummary,
    valueFormatterCarbon,
    valueFormatterEnergy,
} from "@/lib/utilities";
import {
    CalculationMode,
    EnergyMode,
    TimelineData,
} from "@/models/dashboard-data";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { Flex, Heading } from "@radix-ui/themes";
import { LineChart } from "@tremor/react";
import { useTranslations } from "next-intl";
import { SetStateAction, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import MonthPicker from "../ui/month-picker";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertTitle } from "../ui/alert";
import { Info } from "lucide-react";

/**
 * Renders a Consumption Timeline Chart with various controls for energy mode, calculation mode, and date range.
 *
 * @param {GlobalSummary | undefined} globalSummaryData - The global summary data.
 * @param {ConsumptionCategory[]} categories - The consumption categories.
 * @param {string} title - The title of the chart.
 * @return {JSX.Element} The rendered consumption timeline chart.
 */
export function ConsumptionTimelineChart({
    globalSummaryData,
    categories,
    title,
}: {
    globalSummaryData: GlobalSummary | undefined;
    categories: ConsumptionCategory[];
    title: string;
}): JSX.Element {
    const t = useTranslations();

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear() - 1, 0, 1),
        to: new Date(new Date().getFullYear(), 11, 31),
    });

    const [transformedData, setTransformedData] = useState<TimelineData[]>([]);

    const handleDateChange = (
        dateRange: SetStateAction<DateRange | undefined>,
    ) => {
        setDateRange(dateRange);
    };

    const [calculationMode, setCalculationMode] =
        useState<CalculationMode>("absolute");

    const handleCalculationModeChange = (calculationMode: CalculationMode) => {
        setCalculationMode(calculationMode);
    };

    const [selectedEnergyMode, setSelectedEnergyMode] =
        useState<EnergyMode>("carbon");

    const handleEnergyModeChange = (selectedEnergyMode: string) => {
        setSelectedEnergyMode(selectedEnergyMode as EnergyMode);
    };

    useEffect(() => {
        const updatedTemporalData = temporalData(
            globalSummaryData,
            selectedEnergyMode,
            categories,
            dateRange,
            calculationMode,
        );
        setTransformedData(updatedTemporalData);
    }, [
        globalSummaryData,
        selectedEnergyMode,
        categories,
        calculationMode,
        dateRange,
    ]);

    return (
        <>
            <Flex justify="between">
                <Heading>{title}</Heading>
            </Flex>
            <Flex
                direction={{ initial: "column", xs: "row" }}
                className="gap-6 mt-6 mb-6"
            >
                <Tabs
                    value={selectedEnergyMode}
                    onValueChange={handleEnergyModeChange}
                >
                    <div className="overflow-x-auto">
                        <TabsList>
                            <TabsTrigger value="carbon">
                                {
                                    // t("common.co2emission")
                                    t.rich("common.co2emission", {
                                        sub: (chunks) => <sub>{chunks}</sub>,
                                    })
                                }
                            </TabsTrigger>
                            <TabsTrigger value="energy">
                                {t("common.energyUsage")}
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </Tabs>

                <MonthPicker
                    dateRange={dateRange}
                    validYears={getYearsInSummary(globalSummaryData)}
                    onChange={handleDateChange}
                />

                <Select
                    value={calculationMode}
                    onValueChange={handleCalculationModeChange}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue defaultValue="absolute" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="absolute">
                            {t("dashboard.filter.absolute")}
                        </SelectItem>
                        <SelectItem value="average">
                            {t("dashboard.filter.averagePerUser")}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </Flex>

            {dateRange?.from &&
            dateRange?.to &&
            dateRange.from < dateRange.to ? (
                <LineChart
                    className="h-80 mt-8"
                    data={transformedData}
                    index="Date"
                    categories={
                        globalSummaryData?.countries.map(
                            (country) => country.countryName,
                        ) ?? []
                    }
                    colors={countriesMapping.map((country) => country.color)}
                    valueFormatter={
                        selectedEnergyMode == "carbon"
                            ? valueFormatterCarbon
                            : valueFormatterEnergy
                    }
                    showLegend={true}
                    yAxisWidth={60}
                />
            ) : (
                <Alert variant={"destructive"}>
                    <Info className="h-4 w-4" />
                    <AlertTitle>
                        {t("dashboard.card.invalidDateRange")}
                    </AlertTitle>
                </Alert>
            )}
        </>
    );
}
