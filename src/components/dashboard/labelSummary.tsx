"use client";

import { labelMappings } from "@/lib/constants";
import { annualLabelData } from "@/lib/transformData";
import {
    valueFormatterAbsolute,
    valueFormatterPercentage,
} from "@/lib/utilities";
import { EnergyMode, LabelEntries } from "@/models/dashboard-data";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { BarChart } from "@tremor/react";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface LabelChartData extends LabelEntries {
    country: string;
}

/**
 * Extracts unique years from the global summary data.
 *
 * @param {GlobalSummary | undefined} globalSummaryData - the global summary data
 * @return {string[]} an array of unique years
 */
function extractYears(globalSummaryData: GlobalSummary | undefined): string[] {
    // Use a Set to store unique years without duplicates
    const yearsSet = new Set<string>();

    // Traverse the structure to reach the GlobalSummaryCategoryTemporalYear level
    globalSummaryData?.countries.forEach((country) => {
        country.cities.forEach((city) => {
            city.categories.forEach((category) => {
                category.temporal.forEach((temporalYear) => {
                    // Add the year to the Set
                    yearsSet.add(temporalYear.year);
                });
            });
        });
    });

    // Convert the Set to an Array to return the years
    return Array.from(yearsSet);
}

export function LabelSummary({
    globalSummaryData,
    categories,
    title,
    description,
}: {
    globalSummaryData: GlobalSummary | undefined;
    categories: ConsumptionCategory[];
    title: string;
    description: string;
}): JSX.Element {
    const [transformedData, setTransformedData] = useState<
        LabelChartData[] | undefined
    >([]);

    const [useAbsoluteValues, setUseAbsoluteValues] = useState<boolean>(false);

    const [selectedEnergyMode, setSelectedEnergyMode] =
        useState<EnergyMode>("carbon");

    const [selectedYear, setSelectedYear] = useState<string>(
        new Date().getFullYear().toString(),
    );

    const handleEnergyModeChange = (selectedEnergyMode: string) => {
        setSelectedEnergyMode(selectedEnergyMode as EnergyMode);
    };

    useEffect(() => {
        const updatedTemporalData = annualLabelData(
            globalSummaryData,
            selectedEnergyMode,
            categories,
            selectedYear,
        );

        const finalData: LabelChartData[] | undefined =
            updatedTemporalData?.map((data) => {
                const categoryData = data.labels;
                const total = Object.keys(categoryData).reduce(
                    (acc, key) => acc + categoryData[key],
                    0,
                );

                // Divide the values by total if useAbsoluteValues is false, otherwise use the value as is
                const processedData = Object.keys(categoryData).reduce(
                    (acc, key) => {
                        acc[key] = useAbsoluteValues
                            ? categoryData[key]
                            : categoryData[key] / total;
                        return acc;
                    },
                    {} as typeof categoryData,
                );

                return {
                    ...processedData,
                    country: data.countryName,
                };
            });

        setTransformedData(finalData);
    }, [
        globalSummaryData,
        selectedEnergyMode,
        categories,
        selectedYear,
        useAbsoluteValues,
    ]);

    return (
        <>
            <Flex justify="between">
                <Heading>{title}</Heading>

                <div className="flex items-center space-x-2">
                    <Switch
                        id="percentage-switch"
                        onCheckedChange={setUseAbsoluteValues}
                    />
                    <Label htmlFor="percentage-switch">Absolute values</Label>
                </div>
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
                                CO<sub>2</sub> Emission
                            </TabsTrigger>
                            <TabsTrigger value="energy">
                                Energy Usage
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </Tabs>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue defaultValue={selectedYear} />
                    </SelectTrigger>

                    <SelectContent>
                        {extractYears(globalSummaryData).map((year) => (
                            <SelectItem key={year} value={year}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Flex>
            <BarChart
                className="mt-4 h-80"
                data={transformedData ?? []}
                index="country"
                categories={labelMappings.map((label) => label.label)}
                colors={labelMappings.map((label) => label.color)}
                valueFormatter={
                    useAbsoluteValues
                        ? valueFormatterAbsolute
                        : valueFormatterPercentage
                }
                maxValue={useAbsoluteValues ? undefined : 1}
                stack={true}
                relative={true}
                layout="vertical"
                showLegend={true}
            />
            <Text>{description}</Text>
        </>
    );
}
