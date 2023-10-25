import { SingleUser } from "@/models/userData";
import { cities, countries } from "./constants";

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
    return {
        code: countries.find((country) => country.ID == inputID)?.code || "00",
        name:
            countries.find((country) => country.ID == inputID)?.name ||
            "unknown",
    };
}

export function city2Name(inputID: string) {
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

export function camelCaseToWords(s: string) {
    const result = s.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}
