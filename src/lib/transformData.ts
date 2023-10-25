import { Summaries, MetaData, ConsumptionsCount } from "@/models/summary";
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
    let transformedData: TimelineData[] = [];
    let legendItems: string[] = [];

    sourceData.forEach((entry) => {
        if (!entry) {
            return;
        }

        let currentData: TimelineData = {};

        const dateDay = secondsToDateTime(entry?.date).getDate();
        const dateMonth = secondsToDateTime(entry?.date).getMonth() + 1;
        const dateYear = secondsToDateTime(entry?.date).getFullYear();
        currentData.Date = `${dateDay}.${dateMonth}.${dateYear}`;

        entry?.countries.forEach((country) => {
            let countrySum = 0;
            let registeredUsersSum = 0;

            country.cities.forEach((city) => {
                city.categories.map((item) => {
                    countrySum +=
                        mode == "carbon"
                            ? item.carbonEmissions
                            : item.energyExpended;
                });
                registeredUsersSum =
                    registeredUsersSum + (city.users.userCount || 0);
            });
            currentData[country.countryName] =
                calculationMode == "absolute"
                    ? countrySum
                    : countrySum / registeredUsersSum;
            legendItems.indexOf(country.countryName) === -1
                ? legendItems.push(country.countryName)
                : null;
        });
        transformedData.push(currentData);
    });

    transformedData.sort(function (a, b) {
        var keyA = new Date(Date.parse(a.Date!)),
            keyB = new Date(Date.parse(b.Date!));
        // Compare the 2 dates
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
        let consumptionsCountSum: ConsumptionsCount = {
            electricity: { total: 0, sources: [] },
            heating: { total: 0, sources: [] },
            transportation: { total: 0, sources: [] },
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

            // Electricity
            let findElectricity = city.categories.find(
                (e) => e.category == "electricity",
            );
            if (findElectricity) {
                consumptionsCountSum.electricity.total =
                    consumptionsCountSum.electricity.total +
                    (findElectricity.consumptionsCount || 0);

                findElectricity.sourceData.forEach((source) => {
                    let thisConsumptionSource =
                        consumptionsCountSum.electricity.sources.find(
                            (e) => e.source == source.source,
                        );
                    if (!thisConsumptionSource) {
                        consumptionsCountSum.electricity.sources.push({
                            source: source.source,
                            sourceName: camelCaseToWords(source.source),
                            count: 0,
                        });
                        thisConsumptionSource =
                            consumptionsCountSum.electricity.sources.find(
                                (e) => e.source == source.source,
                            );
                    }
                    thisConsumptionSource!.count =
                        (thisConsumptionSource?.count || 0) + 1;
                });
            }

            // Heating
            let findHeating = city.categories.find(
                (e) => e.category == "heating",
            );
            if (findHeating) {
                consumptionsCountSum.heating.total =
                    consumptionsCountSum.heating.total +
                    (findHeating.consumptionsCount || 0);

                findHeating.sourceData.forEach((source) => {
                    let thisConsumptionSource =
                        consumptionsCountSum.heating.sources.find(
                            (e) => e.source == source.source,
                        );
                    if (!thisConsumptionSource) {
                        consumptionsCountSum.heating.sources.push({
                            source: source.source,
                            sourceName: camelCaseToWords(source.source),
                            count: 0,
                        });
                        thisConsumptionSource =
                            consumptionsCountSum.heating.sources.find(
                                (e) => e.source == source.source,
                            );
                    }
                    thisConsumptionSource!.count =
                        (thisConsumptionSource?.count || 0) + 1;
                });
            }

            // Transportation
            let findTransportation = city.categories.find(
                (e) => e.category == "transportation",
            );
            if (findTransportation) {
                consumptionsCountSum.transportation.total =
                    consumptionsCountSum.transportation.total +
                    (findTransportation.consumptionsCount || 0);

                findTransportation.sourceData.forEach((source) => {
                    let thisConsumptionSource =
                        consumptionsCountSum.transportation.sources.find(
                            (e) => e.source == source.source,
                        );
                    if (!thisConsumptionSource) {
                        consumptionsCountSum.transportation.sources.push({
                            source: source.source,
                            sourceName: camelCaseToWords(source.source),
                            count: 0,
                        });
                        thisConsumptionSource =
                            consumptionsCountSum.transportation.sources.find(
                                (e) => e.source == source.source,
                            );
                    }
                    thisConsumptionSource!.count =
                        (thisConsumptionSource?.count || 0) + 1;
                });
            }

            /*recurringConsumptionsCountSum +=
                city.users.recurringConsumptionsCount || 0;*/

            // Female
            let findFemale = city.users.genders.find(
                (e) => e.demographicCategory == "female",
            );
            if (findFemale) {
                genderSums.female = genderSums.female + (findFemale.count || 0);
            }
            // Male
            let findMale = city.users.genders.find(
                (e) => e.demographicCategory == "male",
            );
            if (findMale) {
                genderSums.male = genderSums.male + (findMale.count || 0);
            }
            // Non-Binary
            let findNonBinary = city.users.genders.find(
                (e) => e.demographicCategory == "non-binary",
            );
            if (findNonBinary) {
                genderSums.nonBinary =
                    genderSums.nonBinary + (findNonBinary.count || 0);
            }
            // Other
            let findOther = city.users.genders.find(
                (e) => e.demographicCategory == "other",
            );
            if (findOther) {
                genderSums.other = genderSums.other + (findOther.count || 0);
            }
        });

        metaData.push({
            country: country.countryName,
            userCount: userCountSum,
            consumptionsCount: consumptionsCountSum,
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
