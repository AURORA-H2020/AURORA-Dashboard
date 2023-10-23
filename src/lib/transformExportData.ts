import {
    UserData,
    SingleUser,
    SingleConsumption,
    ConsumptionCategory,
} from "@/models/userData";
import { Summary } from "@/models/summary";
import { country2Name, city2Name, hasConsumptions } from "./utilities";

function transformExportData(sourceData: UserData, date: number) {
    const data = sourceData.data;

    let summary: Summary = {
        date: date,
        daysPeriod: 1,
        countries: [],
    };

    Object.keys(data).forEach((userID) => {
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

        // console.log(thisCity);

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
    });

    // console.log(JSON.stringify(summary, null, 2));
    return summary;
}

export function testTransform(sourceData: UserData) {
    return [
        transformExportData(sourceData, 1672531200),
        transformExportData(sourceData, 1672617600),
    ];
}

function newCountry(countryID: string) {
    return {
        countryID: countryID,
        countryCode: country2Name(countryID).code,
        countryName: country2Name(countryID).name,
        cities: [],
    };
}

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

function newGender(genderName: string) {
    return {
        demographicCategory: genderName,
        count: 0,
    };
}

function newConsumptionSummary(inputCategory: ConsumptionCategory) {
    return {
        category: inputCategory,
        carbonEmissions: 0,
        energyExpended: 0,
        // activeUsers: undefined,
        sourceData: [],
    };
}

function newConsumptionSource(inputSource: string) {
    return {
        source: inputSource,
        carbonEmissions: 0,
        energyExpended: 0,
        value: 0,
    };
}
