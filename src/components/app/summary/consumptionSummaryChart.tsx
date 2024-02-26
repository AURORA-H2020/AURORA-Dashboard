"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loading";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/context/AuthContext";
import { useFirebaseData } from "@/context/FirebaseContext";
import { categories, consumptionMapping } from "@/lib/constants";
import {
    getMonthShortName,
    valueFormatterCarbon,
    valueFormatterEnergy,
} from "@/lib/utilities";
import { ConsumptionSummaryLabeledConsumption } from "@/models/firestore/consumption-summary/consumption-summary-labeled-consumption";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { Flex } from "@radix-ui/themes";
import { BarChart } from "@tremor/react";
import { User } from "firebase/auth";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface CurrentSummary {
    month: number;
    heating: number;
    electricity: number;
    transportation: number;
}

/**
 * Finds and returns the total carbon emission or energy expended for a given category.
 *
 * @param {Array<{ category: ConsumptionCategory; carbonEmission: ConsumptionSummaryLabeledConsumption; energyExpended: ConsumptionSummaryLabeledConsumption }>} categories - The array of categories with their corresponding carbon emission and energy expended.
 * @param {ConsumptionCategory} categoryToFind - The category to find.
 * @param {"carbonEmission" | "energyExpended"} measure - The measure to retrieve, either "carbonEmission" or "energyExpended".
 * @return {number} The total carbon emission or energy expended for the given category, or 0 if the category is not found.
 */
const findValueByCategory = (
    categories: {
        category: ConsumptionCategory;
        carbonEmission: ConsumptionSummaryLabeledConsumption;
        energyExpended: ConsumptionSummaryLabeledConsumption;
    }[],
    categoryToFind: ConsumptionCategory,
    measure: "carbonEmission" | "energyExpended",
): number => {
    const category = categories.find((c) => c.category === categoryToFind);
    return category ? category[measure].total : 0;
};

/**
 * React component for displaying consumption summary chart.
 */
export default function ConsumptionSummaryChart() {
    const t = useTranslations();

    const { user, loading } = useAuthContext() as {
        user: User;
        loading: boolean;
    };

    const { userConsumptionSummaries } = useFirebaseData();

    const [currentSummary, setCurrentSummary] = useState<CurrentSummary[]>([]);

    const [summaryYear, setSummaryYear] = useState<string>(() => {
        const maxYear = userConsumptionSummaries.reduce(
            (max, summary) => Math.max(max, summary.year),
            0,
        );
        return maxYear.toString();
    });

    const [currentMeasure, setCurrentMeasure] = useState<
        "carbonEmission" | "energyExpended"
    >("carbonEmission");

    /**
     * Initializes summary data for 12 months with default values.
     *
     * @return {Array} Array of summary data for each month
     */
    const initializeSummaryData = () => {
        return Array.from({ length: 12 }, (_, index) => ({
            month: index + 1,
            monthName: getMonthShortName(index + 1),
            heating: 0,
            electricity: 0,
            transportation: 0,
        }));
    };

    useEffect(() => {
        if (loading || !user || !summaryYear) return;

        // This effect runs when summaryYear changes, including when it's initially set
        const summaryData = userConsumptionSummaries.find(
            (summary) => summary.year === parseInt(summaryYear),
        );

        // Initialize with default values for each month
        const baseSummaryData = initializeSummaryData();

        if (summaryData) {
            const transformedData = summaryData.months.reduce((acc, month) => {
                acc[month.number - 1] = {
                    month: month.number,
                    monthName: getMonthShortName(month.number),
                    heating: findValueByCategory(
                        month.categories,
                        "heating",
                        currentMeasure,
                    ),
                    electricity: findValueByCategory(
                        month.categories,
                        "electricity",
                        currentMeasure,
                    ),
                    transportation: findValueByCategory(
                        month.categories,
                        "transportation",
                        currentMeasure,
                    ),
                };
                return acc;
            }, baseSummaryData);

            setCurrentSummary(transformedData);
        } else {
            // If no data is found for the selected year, use the base summary with zeroes
            setCurrentSummary(baseSummaryData);
        }
    }, [user, loading, summaryYear, userConsumptionSummaries, currentMeasure]);

    if (!user && loading) {
        // Render loading indicator until the auth check is complete
        return <LoadingSpinner />;
    }

    return (
        <Card className="my-4">
            <CardHeader>
                <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <Flex
                    direction={{ initial: "column", xs: "row" }}
                    className="gap-6 mt-6 mb-6"
                >
                    <Tabs
                        defaultValue="carbonEmission"
                        onValueChange={(value) => {
                            if (
                                value === "carbonEmission" ||
                                value === "energyExpended"
                            ) {
                                setCurrentMeasure(value);
                            }
                            // Optionally, handle the case where the value is not expected
                            else {
                                console.error(
                                    "Invalid value for setCurrentMeasure:",
                                    value,
                                );
                            }
                        }}
                    >
                        <div className="overflow-x-auto">
                            <TabsList>
                                <TabsTrigger value="carbonEmission">
                                    {
                                        // t("common.co2emission")
                                        t.rich("common.co2emission", {
                                            sub: (chunks) => (
                                                <sub className="mr-1">
                                                    {chunks}
                                                </sub>
                                            ),
                                        })
                                    }
                                </TabsTrigger>
                                <TabsTrigger value="energyExpended">
                                    {t("common.energyUsage")}
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </Tabs>
                    <Select value={summaryYear} onValueChange={setSummaryYear}>
                        <SelectTrigger className="w-24">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {userConsumptionSummaries.map((summary) => {
                                    return (
                                        <SelectItem
                                            value={summary.year.toString()}
                                            key={summary.year}
                                        >
                                            {summary.year}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Flex>
                <BarChart
                    className="mt-4"
                    yAxisWidth={80}
                    data={currentSummary}
                    index="monthName"
                    categories={categories}
                    colors={consumptionMapping.map((c) => c.colorPrimary)}
                    valueFormatter={
                        currentMeasure === "carbonEmission"
                            ? valueFormatterCarbon
                            : valueFormatterEnergy
                    }
                    stack={true}
                />
            </CardContent>
        </Card>
    );
}
