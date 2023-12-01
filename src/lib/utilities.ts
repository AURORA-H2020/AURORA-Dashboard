import { SingleUser } from "@/models/userData";
import { cities, countries } from "./constants";

/**
 * Converts a number of seconds to a Date object representing the corresponding date and time.
 *
 * @param {number} seconds - The number of seconds to convert.
 * @return {Date} The Date object representing the corresponding date and time.
 */
export function secondsToDateTime(seconds: number): Date {
    const date = new Date(0);
    date.setSeconds(seconds);
    date.setHours(0, 0, 0, 0);
    return date;
}

/**
 * Capitalizes the first letter of a string and converts the rest of the string to lowercase.
 *
 * @param {string} string - The input string to be converted.
 * @return {string} - The converted string with the first letter capitalized and the rest in lowercase.
 */
export function titleCase(string: string): string {
    const words = string.toLowerCase().split(" ");
    const titleCaseWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return titleCaseWords.join(" ");
}

/**
 * Retrieves the country code and name based on the input ID.
 *
 * @param {string} inputID - The ID of the country.
 * @returns {object} An object containing the country code and name.
 */
export function country2Name(inputID: string) {
    const country = countries.find((country) => country.ID === inputID);
    const code = country?.code || "00";
    const name = country?.name || "unknown";
    return { code, name };
}

/**
 * Finds the name of a city based on its ID.
 *
 * @param {string} inputID - The ID of the city to find the name for.
 * @return {string} The name of the city if found, otherwise "Other".
 */
export function city2Name(inputID: string) {
    const city = cities.find((city) => city.ID == inputID);
    return city ? city.name : "Other";
}

/**
 * Checks if the user has any consumptions.
 *
 * @param {SingleUser} user - The user object to check.
 * @return {boolean} Returns true if the user has consumptions, false otherwise.
 */
export function hasConsumptions(user: SingleUser) {
    const hasConsumptions =
        user.__collections__.consumptions &&
        Object.keys(user.__collections__.consumptions).length > 0;
    return hasConsumptions;
}

/**
 * Checks if the user has a consumption summary.
 *
 * @param {SingleUser} user - The user object.
 * @return {boolean} - Returns true if the user has a consumption summary, otherwise false.
 */
export function hasConsumptionSummary(user: SingleUser) {
    const hasSummaries =
        user.__collections__["consumption-summaries"] &&
        Object.keys(user.__collections__["consumption-summaries"]).length > 0;
    return hasSummaries;
}

/**
 * Returns the short name of a month given its number.
 *
 * @param {number} monthNumber - The number of the month.
 * @returns {string} The short name of the month.
 */
export function getMonthShortName(monthNumber: number): string {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    const options: Intl.DateTimeFormatOptions = { month: "short" };
    return date.toLocaleString("en-GB", options);
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
