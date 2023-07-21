import { Summaries, MetaData } from "@/models/summary";
import { secondsToDateTime } from "./utilities";

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
            let activeUsersSum = 0;

            country.cities.forEach((city) => {
                city.categories.map((item) => {
                    countrySum +=
                        mode == "carbon"
                            ? item.carbonEmission
                            : item.energyUsed;
                    activeUsersSum += item.activeUsers;
                });
            });
            currentData[country.countryCode] =
                calculationMode == "absolute"
                    ? countrySum
                    : countrySum / activeUsersSum;
            legendItems.indexOf(country.countryCode) === -1
                ? legendItems.push(country.countryCode)
                : null;
        });
        transformedData.push(currentData);
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

    console.log(sourceData);

    latestEntry?.countries.forEach((country) => {
        let userCountSum = 0;
        let consumptionsCountSum = 0;
        let recurringConsumptionsCountSum = 0;
        let genderSums = {
            male: 0,
            female: 0,
            nonBinary: 0,
            other: 0,
        };

        country.cities.forEach((city) => {
            userCountSum += city.users.userCount;
            consumptionsCountSum += city.users.consumptionsCount;
            recurringConsumptionsCountSum +=
                city.users.recurringConsumptionsCount;
            /*
            genderSums.female +=
                city.users.genders.find(
                    (e) => e.demographicCategory == "female",
                )?.count ?? 0;
            genderSums.male +=
                city.users.genders.find((e) => e.demographicCategory == "male")
                    ?.count ?? 0;
            genderSums.nonBinary +=
                city.users.genders.find(
                    (e) => e.demographicCategory == "non-binary",
                )?.count ?? 0;
            genderSums.other +=
                city.users.genders.find((e) => e.demographicCategory == "other")
                    ?.count ?? 0;
            */
        });

        metaData.push({
            country: country.countryCode,
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

    return metaData;
}
