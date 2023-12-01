import { Summaries, MetaData, ConsumptionsDetail } from "@/models/summary";
import {
    camelCaseToWords,
    getMonthShortName,
    secondsToDateTime,
} from "./utilities";

type TimelineData = {
    Date?: string;
    [key: string]: any;
};

export function transformSummaryData(
    sourceData: Summaries,
    mode: "carbon" | "energy",
    calculationMode: "absolute" | "average",
) {
    const transformedData: TimelineData[] = [];
    const legendItems: string[] = [];

    sourceData.forEach((entry) => {
        if (!entry) {
            return;
        }

        const currentData: TimelineData = {};

        const date = secondsToDateTime(entry?.date);
        const formattedDate = `${date.getDate()}.${
            date.getMonth() + 1
        }.${date.getFullYear()}`;
        currentData.Date = formattedDate;

        entry?.countries.forEach((country) => {
            let countrySum = 0;
            let registeredUsersSum = 0;

            country.cities.forEach((city) => {
                city.categories.forEach((item) => {
                    countrySum +=
                        mode === "carbon"
                            ? item.carbonEmissions
                            : item.energyExpended;
                });
                registeredUsersSum += city.users.userCount || 0;
            });

            const countryData =
                calculationMode === "absolute"
                    ? countrySum
                    : countrySum / registeredUsersSum;

            if (!legendItems.includes(country.countryName)) {
                legendItems.push(country.countryName);
            }

            currentData[country.countryName] = countryData;
        });

        transformedData.push(currentData);
    });

    transformedData.sort(function (a, b) {
        var keyA = new Date(Date.parse(a.Date!)),
            keyB = new Date(Date.parse(b.Date!));
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    });

    return transformedData;
}

export function latestTemporalData(
    sourceData: Summaries,
    mode: "carbon" | "energy",
    calculationMode: "absolute" | "average",
) {
    if (sourceData.length == 0) {
        return;
    }

    const latestDate = Math.max(...sourceData.map((e) => e?.date ?? 0));
    const latestEntry = sourceData.find((e) => e?.date === latestDate);

    let transformedData: TimelineData[] = [];

    latestEntry?.countries.forEach((country) => {
        country.cities.forEach((city) =>
            city.categories.forEach((category) => {
                category.temporal.forEach((year) => {
                    year.data.forEach((month) => {
                        const dateMonth = getMonthShortName(month.month);
                        let currentDate = `${dateMonth} ${year.year}`;
                        let thisDate = transformedData.find(
                            (e) => e.Date === currentDate,
                        );
                        if (!thisDate) {
                            transformedData.push({
                                Date: currentDate,
                            });
                            thisDate = transformedData.find(
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

    transformedData.sort(function (a, b) {
        var keyA = new Date(Date.parse(a.Date!)),
            keyB = new Date(Date.parse(b.Date!));

        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    });
    return transformedData;
}

export function latestMetaData(sourceData: Summaries) {
    if (sourceData.length == 0) {
        return;
    }

    const latestDate = Math.max(...sourceData.map((e) => e?.date ?? 0));
    const latestEntry = sourceData.find((e) => e?.date === latestDate);

    let metaData: MetaData = [];

    latestEntry?.countries.forEach((country) => {
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

                    for (const source of category.sourceData) {
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
                        currentSource.count++;
                    }
                }
            }

            const genderCategories = {
                female: "Female",
                male: "Male",
                "non-binary": "Non-Binary",
                other: "Other",
            };

            Object.keys(genderCategories).forEach((category) => {
                const findCategory = city.users.genders.find(
                    (e) => e.demographicCategory === category,
                );
                if (findCategory) {
                    genderSums[category] += findCategory.count || 0;
                }
            });
        });

        metaData.push({
            country: country.countryName,
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
        var textA = a.country.toUpperCase();
        var textB = b.country.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    return metaData;
}
