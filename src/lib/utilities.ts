import { SingleUser } from "@/models/userData";

export function secondsToDateTime(seconds: number) {
    const date = new Date(1970, 0, 1); // Epoch
    date.setSeconds(seconds);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
}

export function titleCase(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

export function country2Name(inputID: string) {
    const countries = [
        { ID: "2E9Ejc8qBJC6HnlPPdIh", name: "Portugal", code: "PT" },
        { ID: "4sq82jNQm3x3bH9Fkijm", name: "Spain", code: "ES" },
        { ID: "8mgi5IR4xn9Yca4zDLtU", name: "United Kingdom", code: "UK" },
        { ID: "KhUolhyvcbdEsPyREqOZ", name: "Slovenia", code: "SI" },
        { ID: "sPXh74wjZf14Jtmkaas6", name: "Europe (Other)", code: "EU" },
        { ID: "udn3GiM30aqviGBkswpl", name: "Denmark", code: "DK" },
    ];
    return {
        code: countries.find((country) => country.ID == inputID)?.code || "00",
        name:
            countries.find((country) => country.ID == inputID)?.name ||
            "unknown",
    };
}

export function city2Name(inputID: string) {
    const cities = [
        { ID: "YIyf65PquFxluWhAAo5C", name: "Évora" },
        { ID: "1VSD4m6qVbOZLot7SFoQ", name: "Madrid" },
        { ID: "OAiIuFNocG4c0kOBtBvr", name: "Forest of Dean" },
        { ID: "FJyeCLprBuOqacpvu3LJ", name: "Ljubljana" },
        { ID: "Au1oUV9pAEtSCu04cfCX", name: "Aarhus" },
    ];

    return cities.find((city) => city.ID == inputID)?.name || "Other";
}

export function hasConsumptions(user: SingleUser) {
    if (
        user.__collections__.consumptions &&
        Object.keys(user.__collections__.consumptions).length > 0
    ) {
        return true;
    } else return false;
}

export function hasConsumptionSummary(user: SingleUser) {
    if (
        user.__collections__["consumption-summaries"] &&
        Object.keys(user.__collections__["consumption-summaries"]).length > 0
    ) {
        return true;
    } else return false;
}

export function getMonthShortName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString("en-GB", {
        month: "short",
    });
}
