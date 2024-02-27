import {
    CalculationMode,
    ConsumptionsDetail,
    EnergyMode,
    LabelEntries,
    MetaData,
    MetaDataSummary,
    TimelineData,
    TimelineLabelData,
} from "@/models/dashboard-data";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { DateRange } from "react-day-picker";
import { genderMappings, labelMappings } from "./constants";
import { getMonthShortName } from "./utilities";

/**
 * Retrieves temporal data based on the provided parameters.
 *
 * @param {GlobalSummary} globalSummaryData - The global summary data.
 * @param {"carbon" | "energy"} mode - The mode of data (carbon or energy).
 * @param {ConsumptionCategory[]} categories - The consumption categories to filter by.
 * @param {DateRange | undefined} dateRange - The date range for the temporal data.
 * @param {"absolute" | "relative"} calculationMode - The calculation mode (absolute or relative).
 * @return {TimelineData[]} The retrieved temporal data.
 */
export function temporalData(
    globalSummaryData: GlobalSummary | undefined,
    mode: EnergyMode,
    categories: ConsumptionCategory[],
    dateRange: DateRange | undefined,
    calculationMode: CalculationMode,
    countryNames: { id: string; name: string }[],
    locale: string,
): TimelineData[] {
    if (!globalSummaryData || !dateRange) {
        return [];
    }

    if (!dateRange.from) {
        dateRange.from = new Date();
    }
    if (!dateRange.to) {
        dateRange.to = new Date();
    }

    let temporalData: TimelineData[] = [];

    globalSummaryData?.countries.forEach((country) => {
        country.cities.forEach((city) =>
            city.categories.forEach((category) => {
                if (!categories.includes(category.category)) {
                    return;
                }

                category.temporal.forEach((year) => {
                    year.data.forEach((month) => {
                        const dateMonth = getMonthShortName(
                            month.month,
                            locale,
                        );

                        let currentDate = `${dateMonth} ${year.year}`;

                        if (
                            dateRange.from! >
                            new Date(parseInt(year.year), month.month - 1)
                        ) {
                            return;
                        }
                        if (
                            dateRange.to! <
                            new Date(parseInt(year.year), month.month - 1)
                        ) {
                            return;
                        }

                        let thisDate = temporalData.find(
                            (e) => e.Date === currentDate,
                        );
                        if (!thisDate) {
                            temporalData.push({
                                Date: currentDate,
                            });
                            thisDate = temporalData.find(
                                (e) => e.Date === currentDate,
                            );
                        }

                        const valueToAdd =
                            (mode == "carbon"
                                ? month.carbonEmissions
                                : month.energyExpended) /
                            (calculationMode == "absolute"
                                ? 1
                                : month.activeUsers);

                        const countryName =
                            countryNames.find((e) => e.id === country.countryID)
                                ?.name || country.countryID;

                        thisDate![countryName] =
                            (thisDate![countryName] || 0) + valueToAdd;
                    });
                });
            }),
        );
    });

    temporalData.sort(function (a, b) {
        var keyA = new Date(Date.parse(a.Date!)),
            keyB = new Date(Date.parse(b.Date!));

        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    });
    return temporalData;
}

/**
 * Calculates the annual label data based on the global summary data, energy mode,
 * categories, and selected year.
 *
 * @param {GlobalSummary | undefined} globalSummaryData - The global summary data
 * @param {EnergyMode} mode - The energy mode
 * @param {ConsumptionCategory[]} categories - The consumption categories
 * @param {string | undefined} selectedYear - The selected year
 * @return {TimelineLabelData[] | undefined} The annual label data or undefined
 */
export function annualLabelData(
    globalSummaryData: GlobalSummary | undefined,
    mode: EnergyMode,
    categories: ConsumptionCategory[],
    selectedYear: string | undefined,
): TimelineLabelData[] | undefined {
    if (!globalSummaryData || !selectedYear) {
        return undefined;
    }

    let temporalData: TimelineLabelData[] = [];

    globalSummaryData?.countries.forEach((country) => {
        const energyLabels = labelMappings.map((label) => label.label);

        let labelSums: LabelEntries = {
            "A+": 0,
            A: 0,
            B: 0,
            C: 0,
            D: 0,
            E: 0,
            F: 0,
            G: 0,
        };

        country.cities.forEach((city) => {
            for (const category of city.categories) {
                const thisYear = category.temporal.filter(
                    (year) => year.year === selectedYear,
                )[0];

                if (!thisYear) {
                    continue;
                }

                const thisCategoryLabels = thisYear.categoryLabels;

                energyLabels.forEach((label) => {
                    const findLabel = thisCategoryLabels.find(
                        (e) => e.label === label,
                    );
                    if (findLabel && categories.includes(category.category)) {
                        labelSums[label] +=
                            mode == "carbon"
                                ? findLabel.carbonEmissions
                                : findLabel.energyExpended;
                    }
                });
            }
        });

        temporalData.push({
            countryID: country.countryID,
            labels: labelSums,
        });
    });

    return temporalData;
}

/**
 * Retrieves metadata from the global summary data.
 *
 * @param {GlobalSummary | undefined} globalSummaryData - the global summary data
 * @return {MetaData} the metadata retrieved from the global summary data
 */
export function getMetaData(
    globalSummaryData: GlobalSummary | undefined,
): MetaData | undefined {
    if (!globalSummaryData) {
        return undefined;
    }

    let metaData: MetaData = [];

    globalSummaryData?.countries.forEach((country) => {
        let userCountSum = 0;
        let consumptionsSummary: ConsumptionsDetail = {
            electricity: {
                count: 0,
                carbonEmissions: 0,
                energyExpended: 0,
                sources: [],
            },
            heating: {
                count: 0,
                carbonEmissions: 0,
                energyExpended: 0,
                sources: [],
            },
            transportation: {
                count: 0,
                carbonEmissions: 0,
                energyExpended: 0,
                sources: [],
            },
        };
        let recurringConsumptionsCountSum = 0;
        let genderSums = {
            male: 0,
            female: 0,
            nonBinary: 0,
            other: 0,
            notSpecified: 0,
        };

        country.cities.forEach((city) => {
            userCountSum += city.users.userCount;

            for (const category of city.categories) {
                const summaryCategory = consumptionsSummary[category.category];

                if (summaryCategory) {
                    summaryCategory.count += category.consumptionsCount ?? 0;
                    summaryCategory.carbonEmissions +=
                        category.carbonEmissions ?? 0;
                    summaryCategory.energyExpended +=
                        category.energyExpended ?? 0;

                    for (const source of category.categorySource) {
                        let currentSource = summaryCategory.sources.find(
                            (e) => e.source === source.source,
                        );
                        if (!currentSource) {
                            currentSource = {
                                source: source.source,
                                count: 0,
                            };
                            summaryCategory.sources.push(currentSource);
                        }
                        currentSource.count += source.count ?? 0;
                    }
                }
            }

            genderMappings.forEach((gender) => {
                const findCategory = city.users.genders.find(
                    (e) => e.demographicCategory === gender.key,
                );
                if (findCategory) {
                    genderSums[gender.key] += findCategory.count || 0;
                }
            });
        });

        metaData.push({
            countryID: country.countryID,
            userCount: userCountSum,
            consumptions: consumptionsSummary,
            recurringConsumptionsCount: recurringConsumptionsCountSum,
            genders: {
                male: genderSums.male,
                female: genderSums.female,
                nonBinary: genderSums.nonBinary,
                other: genderSums.other,
            },
        });
    });

    return metaData;
}

/**
 * Returns a summary of meta data.
 *
 * @param {MetaData | undefined} metaData - the meta data to summarize
 * @return {MetaDataSummary | undefined} the summarized meta data
 */
export function getMetaDataSummary(
    metaData: MetaData | undefined,
): MetaDataSummary | undefined {
    if (!metaData) {
        return undefined;
    }

    const initialValue: MetaDataSummary = {
        userCount: 0,
        consumptions: {
            electricity: {
                count: 0,
                carbonEmissions: 0,
                energyExpended: 0,
            },
            heating: {
                count: 0,
                carbonEmissions: 0,
                energyExpended: 0,
            },
            transportation: {
                count: 0,
                carbonEmissions: 0,
                energyExpended: 0,
            },
            total: {
                count: 0,
                carbonEmissions: 0,
                energyExpended: 0,
            },
        },
        recurringConsumptionsCount: 0,
        genders: {
            male: 0,
            female: 0,
            nonBinary: 0,
            other: 0,
        },
    };

    const reportData = metaData.reduce((accumulator, currentCountry) => {
        // Add values from the current country to the accumulator
        accumulator.userCount += currentCountry.userCount;
        accumulator.recurringConsumptionsCount +=
            currentCountry.recurringConsumptionsCount;

        // Loop through the genders object
        for (const gender in accumulator.genders) {
            accumulator.genders[gender] += currentCountry.genders[gender];
        }

        // Loop through the consumptions object
        for (const category in currentCountry.consumptions) {
            const currentCategory = accumulator.consumptions[category];
            const currentObjectCategory = currentCountry.consumptions[category];

            currentCategory.count += currentObjectCategory.count;
            currentCategory.carbonEmissions += Math.round(
                currentObjectCategory.carbonEmissions,
            );
            currentCategory.energyExpended += Math.round(
                currentObjectCategory.energyExpended,
            );
        }

        // Add totals across consumptions
        accumulator.consumptions["total"].count += Math.round(
            currentCountry.consumptions.electricity.count +
                currentCountry.consumptions.heating.count +
                currentCountry.consumptions.transportation.count,
        );
        accumulator.consumptions["total"].carbonEmissions += Math.round(
            currentCountry.consumptions.electricity.carbonEmissions +
                currentCountry.consumptions.heating.carbonEmissions +
                currentCountry.consumptions.transportation.carbonEmissions,
        );
        accumulator.consumptions["total"].energyExpended += Math.round(
            currentCountry.consumptions.electricity.energyExpended +
                currentCountry.consumptions.heating.energyExpended +
                currentCountry.consumptions.transportation.energyExpended,
        );

        return accumulator;
    }, initialValue);

    return reportData;
}
