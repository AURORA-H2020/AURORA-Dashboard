import {
    citiesMapping,
    countriesMapping,
    consumptionMapping,
} from "./constants";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Consumption } from "@/models/extensions";
import { ConsumptionAttributes } from "@/models/meta-data";

/**
 * Automatically added by shadcn/ui
 * Combines class names, dedupes, and returns the result.
 *
 * @param {ClassValue[]} inputs - An array of class values to merge.
 * @return {string} The merged class names as a single string.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

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
    const country = countriesMapping.find((country) => country.ID === inputID);
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
    const city = citiesMapping.find((city) => city.ID == inputID);
    return city ? city.name : "Other";
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

export function getConsumptionAttributes(
    consumption: Consumption,
): ConsumptionAttributes {
    const consumptionCategory = Object.keys(consumptionMapping).find(
        (key) => key in consumption,
    );

    return consumptionCategory ? consumptionMapping[consumptionCategory] : {};
}
