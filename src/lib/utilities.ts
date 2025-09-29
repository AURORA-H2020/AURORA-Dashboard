import { carbonUnit, countriesMapping } from "@/lib/constants/common-constants";
import {
  consumptionMapping,
  consumptionSources,
} from "@/lib/constants/consumption-constants";
import { ConsumptionAttributes } from "@/models/constants";
import { Consumption } from "@/models/firestore/consumption/consumption";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { GlobalSummary } from "@/models/firestore/global-summary/global-summary";
import { UserSettingsUnitSystem } from "@/models/firestore/user/user-settings/user-settings-unitSystem";
import { type ClassValue, clsx } from "clsx";
import convert from "convert";
import { useFormatter } from "next-intl";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

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
  consumptionCategory: ConsumptionCategory,
): ConsumptionAttributes | undefined {
  const consumptionAttributes = consumptionMapping.find(
    (c) => c.category == consumptionCategory,
  );

  return consumptionAttributes || undefined;
}

/**
 * Formats a number as a string with thousands separators and units for carbon dioxide.
 *
 * @param {number} number - The number to be formatted.
 * @return {string} The formatted number with the unit "kg CO₂".
 */
export const valueFormatterCarbon = (
  number: number,
  unitSystem: "metric" | "imperial" = "metric",
): string => {
  const unit =
    unitSystem == "imperial" ? `lb ${carbonUnit}` : `kg ${carbonUnit}`;
  return `${Intl.NumberFormat("us")
    .format(Math.round(number))
    .toString()} \n ${unit}`;
};

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
  return Array.from(yearsSet).sort((a, b) => Number(b) - Number(a));
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
      countriesMapping.find((country) => country.ID === countryID)?.name ||
      countryID,
    id: countryID,
    color:
      countriesMapping.find((country) => country.ID === countryID)?.color ||
      "#000000",
  }));

  countryLabels.sort((a, b) => a.name.localeCompare(b.name));

  return {
    names: countryLabels.map((country) => country.name),
    colors: countryLabels.map((country) => country.color),
  };
}

/**
 * Retrieves the consumption unit based on the given consumption and unit system.
 *
 * @param {Consumption} consumption - The consumption object.
 * @param {UserSettingsUnitSystem} unitSystem - The unit system.
 * @return {{userUnit: "km" | "mi" | "L" | "gal" | "kWh" | "kg" | "lb"; firebaseUnit: "km" | "L" | "kg" | "kWh;}} - The consumption unit.
 */
export function getConsumptionUnit(
  consumption: Consumption,
  unitSystem: UserSettingsUnitSystem,
): {
  userUnit: "km" | "mi" | "L" | "gal" | "kWh" | "kg" | "lb";
  firebaseUnit: "km" | "L" | "kg" | "kWh";
} {
  let userConsumptionUnit: "km" | "mi" | "L" | "gal" | "kWh" | "kg" | "lb" =
    "kWh";
  let firebaseConsumptionUnit: "km" | "L" | "kg" | "kWh" = "kWh";

  const category = consumption.category;
  const source =
    consumption.electricity?.electricitySource ??
    consumption.heating?.heatingFuel ??
    consumption.transportation?.transportationType ??
    "";

  if (category === "heating") {
    firebaseConsumptionUnit =
      consumptionSources.heating.find((c) => c.source == source)?.unit ?? "kWh";
  } else if (category === "transportation") {
    firebaseConsumptionUnit = "km";
  }

  if (unitSystem === "imperial") {
    if (firebaseConsumptionUnit === "km") {
      userConsumptionUnit = "mi";
    } else if (firebaseConsumptionUnit === "L") {
      userConsumptionUnit = "gal";
    } else if (firebaseConsumptionUnit === "kg") {
      userConsumptionUnit = "lb";
    }
  } else {
    userConsumptionUnit = firebaseConsumptionUnit;
  }

  return {
    userUnit: userConsumptionUnit,
    firebaseUnit: firebaseConsumptionUnit,
  };
}

/**
 * Converts a given value from one unit to another unit system.
 *
 * @param {number} value - The value to be converted.
 * @param {string} unit - The unit of the given value. It can be one of the following:
 *                       "km" for kilometers, "mi" for miles, "L" for liters, "gal" for gallons,
 *                       "kWh" for kilowatt-hours, "kg" for kilograms, "lb" for pounds,
 *                       "L/100km" for liters per 100 kilometers, "mpg" for miles per gallon,
 *                       "kWh/100km" for kilowatt-hours per 100 kilometers, or "mi/kWh" for miles per kilowatt-hour.
 * @param {"imperial" | "metric"} toUnitSystem - The target unit system. It can be either "imperial" or "metric".
 * @return {{ quantity: number; unit: string }} - The converted value and its unit.
 */
export function convertUnit(
  value: number,
  unit:
    | "km"
    | "mi"
    | "L"
    | "gal"
    | "kWh"
    | "kg"
    | "lb"
    | "L/100km"
    | "mpg"
    | "kWh/100km"
    | "mi/kWh",
  toUnitSystem: "imperial" | "metric",
): { quantity: number; unit: string } {
  let convertedData;

  if (unit === "kWh") {
    convertedData = { quantity: value, unit: "kWh" };
  } else if (unit === "L/100km" || unit === "mpg") {
    if (unit === "L/100km" && toUnitSystem === "imperial") {
      const gallonsPerLiter = convert(value, "L").to("imperial gallon");
      const milesPer100Km = convert(100, "km").to("mi");
      convertedData = {
        quantity: milesPer100Km / gallonsPerLiter,
        unit: "mpg",
      };
    } else if (unit === "mpg" && toUnitSystem === "metric") {
      const kilometersPerGallon = convert(value, "mi").to("km");
      const litersPerGallon = convert(1, "imperial gallon").to("L");
      convertedData = {
        quantity: (100 * litersPerGallon) / kilometersPerGallon,
        unit: "L/100km",
      };
    } else {
      convertedData = { quantity: value, unit: unit };
    }
  } else if (unit === "kWh/100km" || unit === "mi/kWh") {
    if (unit === "kWh/100km" && toUnitSystem === "imperial") {
      const milesPer100Km = convert(100, "km").to("mi");
      convertedData = {
        quantity: milesPer100Km / value,
        unit: "mi/kWh",
      };
    } else if (unit === "mi/kWh" && toUnitSystem === "metric") {
      const kilometerPerKilowattHour = convert(value, "mi").to("km");
      convertedData = {
        quantity: 100 / kilometerPerKilowattHour,
        unit: "kWh/100km",
      };
    } else {
      convertedData = { quantity: value, unit: unit };
    }
  } else if (unit === "L" || unit === "gal") {
    if (unit === "L" && toUnitSystem === "imperial") {
      convertedData = {
        quantity: convert(value, "L").to("imperial gallon"),
        unit: "gal",
      };
    } else if (unit === "gal" && toUnitSystem === "metric") {
      convertedData = {
        quantity: convert(value, "imperial gallon").to("L"),
        unit: "L",
      };
    } else {
      convertedData = { quantity: value, unit: unit };
    }
  } else {
    convertedData = convert(value, unit).to("best", toUnitSystem);
  }

  return {
    quantity: convertedData.quantity,
    unit: convertedData.unit,
  };
}

/**
 * A hook that converts a given value from one unit to another unit system.
 *
 * @param {number | undefined} value - The value to be converted.
 * @param {"km" | "mi" | "L" | "gal" | "kWh" | "kg" | "lb" | "L/100km" | "mpg" | "kWh/100km" | "mi/kWh"} unit - The unit of the given value.
 * @param {"imperial" | "metric"} toUnitSystem - The target unit system.
 * @param {string} unitSuffix - The suffix to be appended to the unit.
 * @param {number} digits - The maximum number of fraction digits to be displayed.
 * @return {{ rawNumber: number; number: string; unit: string; toString(): string } | undefined} - The converted value, number, unit, and a toString method.
 */
export function useConvertUnit(
  value: number | undefined,
  unit:
    | "km"
    | "mi"
    | "L"
    | "gal"
    | "kWh"
    | "kg"
    | "lb"
    | "L/100km"
    | "mpg"
    | "kWh/100km"
    | "mi/kWh",
  toUnitSystem: "imperial" | "metric",
  unitSuffix: string = "",
  digits: number = 1,
):
  | { rawNumber: number; number: string; unit: string; toString(): string }
  | undefined {
  const format = useFormatter();

  if (value === undefined) return undefined;

  let convertedData = convertUnit(value, unit, toUnitSystem);

  return {
    rawNumber: convertedData.quantity,
    number: format.number(convertedData.quantity, {
      maximumFractionDigits: digits,
    }),
    unit: `${convertedData.unit} ${unitSuffix}`,
    toString() {
      return `${this.number} ${this.unit}`;
    },
  };
}

/**
 * Extracts the base schema from the given Zod schema.
 *
 * @param {z.ZodTypeAny} schema - The Zod schema to extract the base schema from.
 * @return {z.ZodObject<any> | null} The base schema if found, otherwise null.
 */
function extractBaseSchema(schema: z.ZodTypeAny): z.ZodObject<any> | null {
  if (schema instanceof z.ZodObject) {
    return schema;
  }
  if (schema instanceof z.ZodOptional) {
    return extractBaseSchema(schema._def.innerType);
  }
  if (schema instanceof z.ZodEffects && schema._def.schema) {
    return extractBaseSchema(schema._def.schema);
  }
  return null;
}

/**
 * Checks if a field is required in the given schema.
 *
 * @param {z.ZodType<any>} schema - The schema to check against.
 * @param {string} fieldPath - The name of the field to check.
 * @return {boolean} Indicates if the field is required.
 */
export function isFieldRequired(
  schema: z.ZodTypeAny,
  fieldPath: string,
): boolean {
  const baseSchema = extractBaseSchema(schema);
  if (!baseSchema) return true;

  const shape = baseSchema._def.shape();
  const keys = fieldPath.split(".");

  let currentField = shape;
  for (const key of keys) {
    if (!currentField[key]) {
      return true;
    }

    if (
      currentField[key] instanceof z.ZodObject ||
      currentField[key] instanceof z.ZodEffects
    ) {
      currentField = extractBaseSchema(currentField[key])?._def.shape();
    } else {
      return !(currentField[key] instanceof z.ZodOptional);
    }
  }

  return true;
}

export const dateToKebabCase = (
  date: Date,
  options?: { excludeDay?: boolean },
): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  if (options?.excludeDay) {
    return `${year}-${month}`;
  }
  return `${year}-${month}-${day}`;
};
