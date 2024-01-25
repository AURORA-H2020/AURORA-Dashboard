import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import {
    ConsumptionsDetail,
    MetaData,
    TimelineData,
} from "@/models/dashboard-data";
import { camelCaseToWords, getMonthShortName } from "./utilities";
import { genderMappings } from "./constants";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { DateRange } from "react-day-picker";

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
    globalSummaryData: GlobalSummary,
    mode: "carbon" | "energy",
    categories: ConsumptionCategory[],
    dateRange: DateRange | undefined,
    calculationMode: "absolute" | "average",
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
                        if (dateRange.from! > new Date(currentDate)) {
                            return;
                        }
                        if (dateRange.to! < new Date(currentDate)) {
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
                        thisDate![country.countryName] =
                            mode == "carbon"
                                ? month.carbonEmissions /
                                  (calculationMode == "absolute"
                                      ? 1
                                      : city.users.userCount)
                                : month.energyExpended /
                                  (calculationMode == "absolute"
                                      ? 1
                                      : city.users.userCount);
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
 * Retrieves metadata from the global summary data.
 *
 * @param {GlobalSummary | undefined} globalSummaryData - the global summary data
 * @return {MetaData[]} the metadata retrieved from the global summary data
 */
export function getMetaData(globalSummaryData: GlobalSummary | undefined) {
    if (!globalSummaryData) {
        return;
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
