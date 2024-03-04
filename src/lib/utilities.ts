import { ConsumptionAttributes } from "@/models/constants";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { countriesMapping } from "./constants/constants";
import { consumptionMapping } from "./constants/consumptions";

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
 * Returns the short name of a month given its number.
 *
 * @param {number} monthNumber - The number of the month.
 * @returns {string} The short name of the month.
 */
export function getMonthShortName(
    monthNumber: number,
    locale = "en-GB",
): string {
    const date = new Date(2000, monthNumber - 1, 15);

    const options: Intl.DateTimeFormatOptions = { month: "short" };
    return date.toLocaleString(locale, options);
}

/**
 * Retrieves the consumption attributes for the given consumption category.
 *
 * @param {ConsumptionCategory} ConsumptionCategory - The consumption category to retrieve attributes for
 * @return {ConsumptionAttributes | undefined} The consumption attributes for the given category, or undefined if not found
 */
export function getConsumptionAttributes(
    ConsumptionCategory: ConsumptionCategory,
): ConsumptionAttributes | undefined {
    const consumptionAttributes = consumptionMapping.find(
        (c) => c.category == ConsumptionCategory,
    );

    return consumptionAttributes || undefined;
}

/**
 * Formats a number as a string with thousands separators and units for carbon dioxide.
 *
 * @param {number} number - The number to be formatted.
 * @return {string} The formatted number with the unit "kg CO₂".
 */
export const valueFormatterCarbon = (number: number): string =>
    `${Intl.NumberFormat("us")
        .format(Math.round(number))
        .toString()} \n kg CO\u2082`;

/**
 * Formats the given number as a string representing energy in kilowatt-hours.
 *
 * @param {number} number - The number to format.
 * @return {string} The formatted energy value as a string.
 */
export const valueFormatterEnergy = (number: number): string =>
    `${Intl.NumberFormat("us").format(Math.round(number)).toString()} \n kWh`;

/**
 * Formats the absolute value of a number using the US number format.
 *
 * @param {number} number - the number to be formatted
 * @return {string} the formatted absolute value as a string
 */
export const valueFormatterAbsolute = (number: number): string =>
    Intl.NumberFormat("us").format(number).toString();

/**
 * Formats a number as a percentage value with one decimal place.
 *
 * @param {number} number - the number to be formatted
 * @return {string} the formatted percentage value
 */
export const valueFormatterPercentage = (number: number): string => {
    if (isNaN(number)) {
        return "N/A";
    } else
        return Intl.NumberFormat("us", {
            style: "percent",
            maximumFractionDigits: 1,
        }).format(number);
};

/**
 * Downloads the given object as a JSON file with the specified file name.
 *
 * @param {any} object - the object to be converted to JSON and downloaded
 * @param {string} fileName - the name of the file to be downloaded
 * @return {void}
 */
export const downloadJsonAsFile = async (object, fileName) => {
    const dataStr = JSON.stringify(object);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create a link element, click it, and remove it to start the download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};

/**
 * Extracts unique years from the global summary data.
 *
 * @param {GlobalSummary | undefined} globalSummaryData - the global summary data
 * @return {string[]} an array of unique years
 */
export function getYearsInSummary(
    globalSummaryData: GlobalSummary | undefined,
): string[] {
    // Use a Set to store unique years without duplicates
    const yearsSet = new Set<string>();

    // Traverse the structure to reach the GlobalSummaryCategoryTemporalYear level
    globalSummaryData?.countries.forEach((country) => {
        country.cities.forEach((city) => {
            city.categories.forEach((category) => {
                category.temporal.forEach((temporalYear) => {
                    // Add the year to the Set
                    yearsSet.add(temporalYear.year);
                });
            });
        });
    });

    // Convert the Set to an Array to return the years
    return Array.from(yearsSet);
}

/**
 * Function to get sorted country labels.
 *
 * @param {string[] | undefined} countryIds - The array of country IDs
 * @return {{ names: string[]; colors: string[]; }} An object with names and colors of the countries
 */
export function getSortedCountryLabels(countryIds: string[] | undefined) {
    if (!countryIds) {
        return { names: [], colors: [] };
    }

    const countryLabels = countryIds.map((countryID) => ({
        name:
            countriesMapping.find((country) => country.ID === countryID)
                ?.name || countryID,
        id: countryID,
        color:
            countriesMapping.find((country) => country.ID === countryID)
                ?.color || "#000000",
    }));

    countryLabels.sort((a, b) => a.name.localeCompare(b.name));

    return {
        names: countryLabels.map((country) => country.name),
        colors: countryLabels.map((country) => country.color),
    };
}
