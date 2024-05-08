"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { MonthPicker } from "@/components/ui/month-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { countriesMapping } from "@/lib/constants/constants";
import { temporalData } from "@/lib/transformData";
import {
    getSortedCountryLabels,
    getYearsInSummary,
    valueFormatterCarbon,
    valueFormatterEnergy,
} from "@/lib/utilities";
import { EnergyMode, TimelineData } from "@/models/dashboard-data";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { Flex, Heading } from "@radix-ui/themes";
import { LineChart } from "@tremor/react";
import { Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { SetStateAction, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

/**
 * Renders a Consumption Timeline Chart with various controls for energy mode, calculation mode, and date range.
 *
 * @param {GlobalSummary | undefined} globalSummaryData - The global summary data.
 * @param {ConsumptionCategory[]} categories - The consumption categories.
 * @param {string} title - The title of the chart.
 * @return {React.ReactNode} The rendered consumption timeline chart.
 */
const ConsumptionTimelineChart = ({
    globalSummaryData,
    categories,
    title,
}: {
    globalSummaryData: GlobalSummary | undefined;
    categories: ConsumptionCategory[];
    title: string;
}): React.ReactNode => {
    const t = useTranslations();
    const locale = useLocale();

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

    const [selectedEnergyMode, setSelectedEnergyMode] =
        useState<EnergyMode>("carbon");

    const handleEnergyModeChange = (selectedEnergyMode: string) => {
        setSelectedEnergyMode(selectedEnergyMode as EnergyMode);
    };

    useEffect(() => {
        const countryNames = countriesMapping.map((country) => ({
            id: country.ID,
            name: t(country.name),
        }));
        const updatedTemporalData = temporalData(
            globalSummaryData,
            selectedEnergyMode,
            categories,
            dateRange,
            "relative",
            countryNames,
            locale,
        );

        setTransformedData(updatedTemporalData);
    }, [
        globalSummaryData,
        selectedEnergyMode,
        categories,
        dateRange,
        t,
        locale,
    ]);

    const includedCountryIds = globalSummaryData?.countries.map(
        (country) => country.countryID,
    );

    return (
        <>
            <Flex justify="between">
                <Heading>{title}</Heading>
            </Flex>
            <Flex
                direction={{ initial: "column", sm: "row" }}
                className="gap-2 gap-x-4 mt-6"
            >
                <Tabs
                    value={selectedEnergyMode}
                    onValueChange={handleEnergyModeChange}
                >
                    <div className="overflow-x-auto">
                        <TabsList className="w-full">
                            <TabsTrigger value="carbon" className="w-full">
                                {
                                    // t("common.co2emission")
                                    t.rich("common.co2emission", {
                                        sub: (chunks) => (
                                            <>
                                                <sub className="mr-1">
                                                    {chunks}
                                                </sub>
                                            </>
                                        ),
                                    })
                                }
                            </TabsTrigger>
                            <TabsTrigger value="energy" className="w-full">
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
            </Flex>

            {dateRange?.from &&
            dateRange?.to &&
            dateRange.from < dateRange.to ? (
                <LineChart
                    className="h-80 mt-8"
                    showAnimation={true}
                    data={transformedData}
                    index="dateString"
                    categories={getSortedCountryLabels(
                        includedCountryIds,
                    ).names.map((name) => t(name))}
                    colors={getSortedCountryLabels(includedCountryIds).colors}
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
};

export { ConsumptionTimelineChart };
