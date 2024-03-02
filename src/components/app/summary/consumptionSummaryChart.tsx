"use client";

import { categories, consumptionMapping } from "@/lib/constants";
import { valueFormatterCarbon, valueFormatterEnergy } from "@/lib/utilities";
import { ConsumptionSummary } from "@/models/firestore/consumption-summary/consumption-summary";
import { ConsumptionSummaryLabeledConsumption } from "@/models/firestore/consumption-summary/consumption-summary-labeled-consumption";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { BarChart } from "@tremor/react";
import { useFormatter } from "next-intl";
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
const ConsumptionSummaryChart = ({
    consumptionSummary,
    measure,
}: {
    consumptionSummary: ConsumptionSummary;
    measure: "carbonEmission" | "energyExpended";
}) => {
    const format = useFormatter();

    const [currentSummary, setCurrentSummary] = useState<
        CurrentSummary[] | undefined
    >([]);

    useEffect(() => {
        if (!consumptionSummary) return;

        const initializeSummaryData = () => {
            return Array.from({ length: 12 }, (_, index) => ({
                month: index + 1,
                monthName: format.dateTime(new Date(2000, index, 15), {
                    month: "short",
                }),
                heating: 0,
                electricity: 0,
                transportation: 0,
            }));
        };

        // Initialize with default values for each month
        const baseSummaryData = initializeSummaryData();

        if (consumptionSummary) {
            const transformedData = consumptionSummary.months.reduce(
                (acc, month) => {
                    acc[month.number - 1] = {
                        month: month.number,
                        monthName: format.dateTime(
                            new Date(2000, month.number - 1, 15),
                            {
                                month: "short",
                            },
                        ),
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
            setCurrentSummary(undefined);
        }
    }, [measure, consumptionSummary, format]);

    return (
        <BarChart
            className="mt-4"
            data={currentSummary ?? []}
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
};

export default ConsumptionSummaryChart;
