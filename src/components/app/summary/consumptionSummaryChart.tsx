"use client";

import LoadingSpinner from "@/components/ui/loading";
import { useAuthContext } from "@/context/AuthContext";
import { categories, consumptionMapping } from "@/lib/constants";
import {
    getMonthShortName,
    valueFormatterCarbon,
    valueFormatterEnergy,
} from "@/lib/utilities";
import { ConsumptionSummary } from "@/models/firestore/consumption-summary/consumption-summary";
import { ConsumptionSummaryLabeledConsumption } from "@/models/firestore/consumption-summary/consumption-summary-labeled-consumption";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { BarChart } from "@tremor/react";
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
export default function ConsumptionSummaryChart({
    consumptionSummary,
    measure,
}: {
    consumptionSummary: ConsumptionSummary;
    measure: "carbonEmission" | "energyExpended";
}) {
    const { user, loading } = useAuthContext();

    const [currentSummary, setCurrentSummary] = useState<CurrentSummary[]>([]);

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
        if (loading || !user || !consumptionSummary) return;

        // Initialize with default values for each month
        const baseSummaryData = initializeSummaryData();

        if (consumptionSummary) {
            const transformedData = consumptionSummary.months.reduce(
                (acc, month) => {
                    acc[month.number - 1] = {
                        month: month.number,
                        monthName: getMonthShortName(month.number),
                        heating: findValueByCategory(
                            month.categories,
                            "heating",
                            measure,
                        ),
                        electricity: findValueByCategory(
                            month.categories,
                            "electricity",
                            measure,
                        ),
                        transportation: findValueByCategory(
                            month.categories,
                            "transportation",
                            measure,
                        ),
                    };
                    return acc;
                },
                baseSummaryData,
            );

            setCurrentSummary(transformedData);
        } else {
            // If no data is found for the selected year, use the base summary with zeroes
            setCurrentSummary(baseSummaryData);
        }
    }, [measure, loading, consumptionSummary, user]);

    if (!user && loading) {
        // Render loading indicator until the auth check is complete
        return <LoadingSpinner />;
    }

    return (
        <BarChart
            className="mt-4"
            yAxisWidth={80}
            data={currentSummary}
            index="monthName"
            categories={categories}
            colors={consumptionMapping.map((c) => c.colorPrimary)}
            valueFormatter={
                measure === "carbonEmission"
                    ? valueFormatterCarbon
                    : valueFormatterEnergy
            }
            stack={true}
        />
    );
}
