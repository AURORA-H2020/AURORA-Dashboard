import { SingleUser } from "@/models/userData";
import { cities, countries } from "./constants";

export function secondsToDateTime(seconds: number) {
    const date = new Date(1970, 0, 1); // Epoch
/**
 * Converts a number of seconds to a Date object representing the corresponding date and time.
 *
 * @param {number} seconds - The number of seconds to convert.
 * @return {Date} The Date object representing the corresponding date and time.
 */
export function secondsToDateTime(seconds: number): Date {
    date.setSeconds(seconds);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
}

export function titleCase(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
/**
 * Capitalizes the first letter of a string and converts the rest of the string to lowercase.
 *
 * @param {string} string - The input string to be converted.
 * @return {string} - The converted string with the first letter capitalized and the rest in lowercase.
 */
export function titleCase(string: string): string {
}

/**
 * Retrieves the country code and name based on the input ID.
 *
 * @param {string} inputID - The ID of the country.
 * @returns {object} An object containing the country code and name.
 */
export function country2Name(inputID: string) {
    return {
        code: countries.find((country) => country.ID == inputID)?.code || "00",
        name:
            countries.find((country) => country.ID == inputID)?.name ||
            "unknown",
    };
}

/**
 * Finds the name of a city based on its ID.
 *
 * @param {string} inputID - The ID of the city to find the name for.
 * @return {string} The name of the city if found, otherwise "Other".
 */
export function city2Name(inputID: string) {
    return cities.find((city) => city.ID == inputID)?.name || "Other";
}

/**
 * Checks if the user has any consumptions.
 *
 * @param {SingleUser} user - The user object to check.
 * @return {boolean} Returns true if the user has consumptions, false otherwise.
 */
export function hasConsumptions(user: SingleUser) {
    if (
        user.__collections__.consumptions &&
        Object.keys(user.__collections__.consumptions).length > 0
    ) {
        return true;
    } else return false;
}

/**
 * Checks if the user has a consumption summary.
 *
 * @param {SingleUser} user - The user object.
 * @return {boolean} - Returns true if the user has a consumption summary, otherwise false.
 */
export function hasConsumptionSummary(user: SingleUser) {
    if (
        user.__collections__["consumption-summaries"] &&
        Object.keys(user.__collections__["consumption-summaries"]).length > 0
    ) {
        return true;
    } else return false;
}

export function getMonthShortName(monthNumber) {
/**
 * Returns the short name of a month given its number.
 *
 * @param {number} monthNumber - The number of the month.
 * @returns {string} The short name of the month.
 */
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString("en-GB", {
        month: "short",
    });
}

/**
 * Converts a camel case string to words.
 *
 * @param {string} s - The input string in camel case.
 * @return {string} The converted string with spaces between words.
 */
export function camelCaseToWords(s: string) {
    const result = s.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}
