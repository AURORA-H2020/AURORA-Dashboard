import {
    UserData,
    SingleUser,
    SingleConsumption,
    ConsumptionCategory,
    ConsumptionSummary,
} from "@/models/userData";
import { Summary, SummaryCity } from "@/models/summary";
import {
    country2Name,
    city2Name,
    hasConsumptions,
    hasConsumptionSummary,
} from "./utilities";
import { userIdBlacklist } from "./constants";

/**
 * Transforms the provided export data into a summary object.
 *
 * @param {UserData} sourceData - The source data to transform.
 * @returns {Summary} The transformed summary object.
 */
function transformExportData(sourceData: UserData) {
    const data = sourceData.data;

    let summary: Summary = {
        date: sourceData.meta.creationTime,
        daysPeriod: 1,
        countries: [],
    };

    Object.keys(data).forEach((userID) => {
        if (userIdBlacklist.includes(userID)) {
            // Do nothing for blacklisted users
            return;
        }

        let userData = data[userID] as SingleUser;
        let thisCountry = summary.countries.find(
            (e) => e.countryID === (userData.country || "otherCountry"),
        );
        if (!thisCountry) {
            let countryID: string;
            if (userData.country) {
                countryID = userData.country;
            } else countryID = "otherCountry";
            summary.countries.push(newCountry(countryID));
            thisCountry = summary.countries.find(
                (e) => e.countryID === countryID,
            );
        }
        let thisCity = thisCountry?.cities.find(
            (e) => e.cityID === (userData.city || "otherCity"),
        );
        if (!thisCity) {
            let cityID: string;
            if (userData.city) {
                cityID = userData.city;
            } else cityID = "otherCity";
            thisCountry!.cities.push(newCity(cityID));
            thisCity = thisCountry?.cities.find((e) => e.cityID === cityID);
        }

        let thisGender = thisCity?.users.genders.find(
            (e) => e.demographicCategory === (userData.gender || "unknown"),
        );
        if (!thisGender) {
            let genderName: string;
            if (userData.gender) {
                genderName = userData.gender;
            } else genderName = "unknown";
            thisCity?.users.genders.push(newGender(genderName));
            thisGender = thisCity?.users.genders.find(
                (e) => e.demographicCategory === genderName,
            );
        }
        thisGender!.count = (thisGender?.count || 0) + 1;

        thisCity!.users.userCount = (thisCity?.users.userCount || 0) + 1;

        if (hasConsumptions(userData)) {
            Object.keys(userData.__collections__.consumptions).forEach(
                (consumptionID) => {
                    let consumptionData = userData.__collections__.consumptions[
                        consumptionID
                    ] as SingleConsumption;
                    thisCity!.users.consumptionsCount =
                        (thisCity?.users.consumptionsCount || 0) + 1;

                    let thisConsumption = thisCity?.categories.find(
                        (e) => e.category === consumptionData.category,
                    );
                    if (!thisConsumption) {
                        thisCity?.categories.push(
                            newConsumptionSummary(consumptionData.category),
                        );
                        thisConsumption = thisCity?.categories.find(
                            (e) => e.category === consumptionData.category,
                        );
                    }

                    thisConsumption!.carbonEmissions =
                        (thisConsumption?.carbonEmissions || 0) +
                        (consumptionData.carbonEmissions || 0);
                    thisConsumption!.energyExpended =
                        (thisConsumption?.energyExpended || 0) +
                        (consumptionData.energyExpended || 0);
                    thisConsumption!.consumptionsCount =
                        (thisConsumption?.consumptionsCount || 0) + 1;

                    switch (consumptionData.category) {
                        case "electricity": {
                            const inputSource =
                                consumptionData.electricity
                                    ?.electricitySource || "default";
                            let thisConsumptionSource =
                                thisConsumption?.sourceData.find(
                                    (e) => e.source === inputSource,
                                );
                            if (!thisConsumptionSource) {
                                thisConsumption?.sourceData.push(
                                    newConsumptionSource(inputSource),
                                );
                                thisConsumptionSource =
                                    thisConsumption?.sourceData.find(
                                        (e) => e.source === inputSource,
                                    );
                            }
                            thisConsumptionSource!.carbonEmissions =
                                (thisConsumptionSource?.carbonEmissions || 0) +
                                (consumptionData.carbonEmissions || 0);
                            thisConsumptionSource!.energyExpended =
                                (thisConsumptionSource?.energyExpended || 0) +
                                (consumptionData.energyExpended || 0);
                            thisConsumptionSource!.value =
                                (thisConsumptionSource?.value || 0) +
                                (consumptionData.value || 0);
                        }
                        case "heating": {
                            const inputSource =
                                consumptionData.heating?.heatingFuel;
                            if (inputSource) {
                                let thisConsumptionSource =
                                    thisConsumption?.sourceData.find(
                                        (e) => e.source === inputSource,
                                    );
                                if (!thisConsumptionSource) {
                                    thisConsumption?.sourceData.push(
                                        newConsumptionSource(inputSource),
                                    );
                                    thisConsumptionSource =
                                        thisConsumption?.sourceData.find(
                                            (e) => e.source === inputSource,
                                        );
                                }
                                thisConsumptionSource!.carbonEmissions =
                                    (thisConsumptionSource?.carbonEmissions ||
                                        0) +
                                    (consumptionData.carbonEmissions || 0);
                                thisConsumptionSource!.energyExpended =
                                    (thisConsumptionSource?.energyExpended ||
                                        0) +
                                    (consumptionData.energyExpended || 0);
                                thisConsumptionSource!.value =
                                    (thisConsumptionSource?.value || 0) +
                                    (consumptionData.value || 0);
                            }
                        }
                        case "transportation": {
                            const inputSource =
                                consumptionData.transportation
                                    ?.transportationType;
                            if (inputSource) {
                                let thisConsumptionSource =
                                    thisConsumption?.sourceData.find(
                                        (e) => e.source === inputSource,
                                    );
                                if (!thisConsumptionSource) {
                                    thisConsumption?.sourceData.push(
                                        newConsumptionSource(inputSource),
                                    );
                                    thisConsumptionSource =
                                        thisConsumption?.sourceData.find(
                                            (e) => e.source === inputSource,
                                        );
                                }
                                thisConsumptionSource!.carbonEmissions =
                                    (thisConsumptionSource?.carbonEmissions ||
                                        0) +
                                    (consumptionData.carbonEmissions || 0);
                                thisConsumptionSource!.energyExpended =
                                    (thisConsumptionSource?.energyExpended ||
                                        0) +
                                    (consumptionData.energyExpended || 0);
                                thisConsumptionSource!.value =
                                    (thisConsumptionSource?.value || 0) +
                                    (consumptionData.value || 0);
                            }
                        }
                    }
                },
            );
        }

        if (hasConsumptionSummary(userData)) {
            Object.keys(
                userData.__collections__["consumption-summaries"],
            ).forEach((consumptionSummaryYear) => {
                let consumptionSummaryData = userData.__collections__[
                    "consumption-summaries"
                ][consumptionSummaryYear] as ConsumptionSummary;

                consumptionSummaryData.months.forEach((month) => {
                    month.categories.forEach((category) => {
                        if (thisCity) {
                            thisCity = ensureConsumptionSummary(
                                thisCity,
                                category.category,
                            );
                        }

                        let thisCategory = thisCity?.categories.find(
                            (e) => e.category === category.category,
                        );
                        let thisYear = thisCategory?.temporal.find(
                            (e) => e.year === consumptionSummaryYear,
                        );
                        if (!thisYear) {
                            thisCategory?.temporal.push(
                                newSummaryYear(consumptionSummaryYear),
                            );
                            thisYear = thisCategory?.temporal.find(
                                (e) => e.year === consumptionSummaryYear,
                            );
                        }
                        let thisMonth = thisYear?.data.find(
                            (e) => e.month === month.number,
                        );
                        if (!thisMonth) {
                            thisYear?.data.push(newSummaryMonth(month.number));
                            thisMonth = thisYear?.data.find(
                                (e) => e.month === month.number,
                            );
                        }
                        let monthCategory = month.categories.find(
                            (e) => e.category === thisCategory?.category,
                        );
                        if (monthCategory) {
                            thisMonth!.carbonEmissions =
                                (thisMonth?.carbonEmissions || 0) +
                                (monthCategory.carbonEmission.total || 0);
                            thisMonth!.energyExpended =
                                (thisMonth?.energyExpended || 0) +
                                (monthCategory.energyExpended.total || 0);
                        }
                    });
                });
            });
        }
    });

    return summary;
}

/**
 * Generate the function comment for the given function body.
 *
 * @param {UserData[]} sourceData - the source data array
 * @return {Summary[]} the transformed data array
 */
export function testTransform(sourceData: UserData[]) {
    let dataSet: Summary[] = [];

    sourceData.forEach((e) => {
        dataSet.push(transformExportData(e));
    });
    return dataSet;
}

/**
 * Creates a new country object with the given country ID.
 *
 * @param {string} countryID - The ID of the country.
 * @return {object} - The newly created country object.
 */
function newCountry(countryID: string) {
    return {
        countryID: countryID,
        countryCode: country2Name(countryID).code,
        countryName: country2Name(countryID).name,
        cities: [],
    };
}

/**
 * Creates a new city object with the given city ID.
 *
 * @param {string} cityID - The ID of the city.
 * @return {object} - The newly created city object.
 */
function newCity(cityID: string) {
    return {
        cityID: cityID,
        cityName: city2Name(cityID),
        categories: [],
        users: {
            userCount: 0,
            consumptionsCount: 0,
            // recurringConsumptionsCount: undefined,
            genders: [],
        },
    };
}

/**
 * Creates a new gender object with the given gender name.
 *
 * @param {string} genderName - The name of the gender.
 * @return {object} - The new gender object.
 */
function newGender(genderName: string) {
    return {
        demographicCategory: genderName,
        count: 0,
    };
}

/**
 * Creates a new consumption summary object.
 *
 * @param {ConsumptionCategory} inputCategory - The category of the consumption.
 * @return {object} - The new consumption summary object.
 */
function newConsumptionSummary(inputCategory: ConsumptionCategory) {
    return {
        category: inputCategory,
        carbonEmissions: 0,
        energyExpended: 0,
        consumptionsCount: 0,
        // activeUsers: undefined,
        sourceData: [],
        temporal: [],
    };
}

/**
 * Creates a new consumption source object.
 *
 * @param {string} inputSource - The input source for the consumption.
 * @return {object} - The newly created consumption source object.
 */
function newConsumptionSource(inputSource: string) {
    return {
        source: inputSource,
        carbonEmissions: 0,
        energyExpended: 0,
        value: 0,
    };
}

/**
 * Ensures that a consumption summary exists for the given category in the current city.
 *
 * @param {SummaryCity} currentCity - The current city object.
 * @param {ConsumptionCategory} category - The consumption category to ensure a summary for.
 * @return {SummaryCity} - The updated city object with the consumption summary.
 */
function ensureConsumptionSummary(
    currentCity: SummaryCity,
    category: ConsumptionCategory,
): SummaryCity {
    let thisConsumptionSummary = currentCity.categories.find(
        (consumptionSummary) => consumptionSummary.category === category,
    );

    if (!thisConsumptionSummary) {
        currentCity.categories.push(newConsumptionSummary(category));
    }

    return currentCity;
}

/**
 * Creates a new summary year object with the given current year.
 *
 * @param {string} currentYear - The current year.
 * @return {object} - The new summary year object.
 */
function newSummaryYear(currentYear: string) {
    return {
        year: currentYear,
        data: [],
    };
}

/**
 * Creates a new summary month object with default values for carbon emissions and energy expended.
 *
 * @param {number} currentMonth - The current month.
 * @return {Object} - The new summary month object.
 */
function newSummaryMonth(currentMonth: number) {
    return {
        month: currentMonth,
        carbonEmissions: 0,
        energyExpended: 0,
    };
}
