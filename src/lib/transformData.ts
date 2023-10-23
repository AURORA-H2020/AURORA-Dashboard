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

    return transformedData;
}

export function latestMetaData(sourceData: Summaries) {
    if (sourceData.length == 0) {
        return;
    }

    const latestDate = Math.max(...sourceData.map((e) => e?.date ?? 0));
    const latestEntry = sourceData.find((e) => e?.date === latestDate);

    let metaData: MetaData = [];

    // console.log(sourceData);

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
                city.users.recurringConsumptionsCount || 0;

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

    return metaData;
}
