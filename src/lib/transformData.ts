import {
    CalculationMode,
    ConsumptionsDetail,
    EnergyMode,
    LabelEntries,
    MetaData,
    TimelineData,
    TimelineLabelData,
} from "@/models/dashboard-data";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { DateRange } from "react-day-picker";
import { genderMappings, labelMappings } from "./constants";
import { camelCaseToWords, getMonthShortName } from "./utilities";

/**
 * Retrieves temporal data based on the provided parameters.
 *
 * @param {GlobalSummary} globalSummaryData - The global summary data.
 * @param {"carbon" | "energy"} mode - The mode of data (carbon or energy).
 * @param {ConsumptionCategory[]} categories - The consumption categories to filter by.
 * @param {DateRange | undefined} dateRange - The date range for the temporal data.
 * @param {"absolute" | "average"} calculationMode - The calculation mode (absolute or average).
 * @return {TimelineData[]} The retrieved temporal data.
 */
export function temporalData(
    globalSummaryData: GlobalSummary | undefined,
    mode: EnergyMode,
    categories: ConsumptionCategory[],
    dateRange: DateRange | undefined,
    calculationMode: CalculationMode,
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
                        const dateMonth = getMonthShortName(month.month);

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

                        thisDate![country.countryName] =
                            (thisDate![country.countryName] || 0) + valueToAdd;
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
            countryName: country.countryName,
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
                                sourceName: camelCaseToWords(source.source),
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
            countryName: country.countryName,
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

    metaData.sort(function (a, b) {
        var textA = a.countryName.toUpperCase();
        var textB = b.countryName.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    return metaData;
}
