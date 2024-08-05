"use client";

import { useFirebaseData } from "@/context/FirebaseContext";
import { consumptionMapping } from "@/lib/constants/consumptions";
import { valueFormatterCarbon, valueFormatterEnergy } from "@/lib/utilities";
import { ConsumptionSummary } from "@/models/firestore/consumption-summary/consumption-summary";
import { ConsumptionSummaryLabeledConsumption } from "@/models/firestore/consumption-summary/consumption-summary-labeled-consumption";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { UserSettingsUnitSystem } from "@/models/firestore/user/user-settings/user-settings-unitSystem";
import { BarChart } from "@tremor/react";
import convert from "convert";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface CurrentSummary {
    month: number;
    [key: string]: number;
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

const convertChartUnit = (
    userUnitSystem: UserSettingsUnitSystem,
    value: number,
    measure: "carbonEmission" | "energyExpended",
): number => {
    if (measure === "carbonEmission" && userUnitSystem === "imperial") {
        return convert(value, "kg").to("lb");
    } else return value;
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
    const t = useTranslations();
    const format = useFormatter();

    const { userData } = useFirebaseData();

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
                [t(
                    consumptionMapping.find((e) => e.category === "heating")
                        ?.label,
                )]: 0,
                [t(
                    consumptionMapping.find((e) => e.category === "electricity")
                        ?.label,
                )]: 0,
                [t(
                    consumptionMapping.find(
                        (e) => e.category === "transportation",
                    )?.label,
                )]: 0,
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
                        [t(
                            consumptionMapping.find(
                                (e) => e.category === "heating",
                            )?.label,
                        )]: convertChartUnit(
                            userData?.settings?.unitSystem ?? "metric",
                            findValueByCategory(
                                month.categories,
                                "heating",
                                measure,
                            ),
                            measure,
                        ),
                        [t(
                            consumptionMapping.find(
                                (e) => e.category === "electricity",
                            )?.label,
                        )]: convertChartUnit(
                            userData?.settings?.unitSystem ?? "metric",
                            findValueByCategory(
                                month.categories,
                                "electricity",
                                measure,
                            ),
                            measure,
                        ),
                        [t(
                            consumptionMapping.find(
                                (e) => e.category === "transportation",
                            )?.label,
                        )]: convertChartUnit(
                            userData?.settings?.unitSystem ?? "metric",
                            findValueByCategory(
                                month.categories,
                                "transportation",
                                measure,
                            ),
                            measure,
                        ),
                    };
                    console.log(acc);
                    return acc;
                },
                baseSummaryData,
            );

            setCurrentSummary(transformedData as CurrentSummary[]);
        } else {
            setCurrentSummary(undefined);
        }
    }, [measure, consumptionSummary, format, t, userData]);

    return (
        <BarChart
            className="mt-4"
            data={currentSummary ?? []}
            index="monthName"
            categories={consumptionMapping.map((c) => t(c.label))}
            colors={consumptionMapping.map((c) => c.colorPrimary)}
            valueFormatter={
                measure === "carbonEmission"
                    ? (value) =>
                          valueFormatterCarbon(
                              value,
                              userData?.settings?.unitSystem,
                          )
                    : valueFormatterEnergy
            }
            stack={true}
        />
    );
};

export { ConsumptionSummaryChart };
