import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { convertUnit, getConsumptionUnit } from "@/lib/utilities";
import { Consumption } from "@/models/firestore/consumption/consumption";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";

// Initialize Firestore
const firestore = getFirestore(firebaseApp);

/**
 * Removes invalid values from the given consumption object based on the specified category.
 *
 * @param {Consumption} consumption - The consumption object to remove invalid values from.
 * @param {ConsumptionCategory} category - The category of the consumption object.
 * @return {Consumption} The consumption object with invalid values removed.
 */
function removeInvalidValues(
  consumption: Consumption,
  category: ConsumptionCategory,
): Consumption {
  const keysToCheck = [
    "costs",
    "districtHeatingSource",
    "privateVehicleOccupancy",
    "publicVehicleOccupancy",
    "dateOfTravelEnd",
    "fuelConsumption",
    "electricityExported",
  ];
  keysToCheck.forEach((key) => {
    if (
      Object.prototype.hasOwnProperty.call(consumption, category) &&
      Object.prototype.hasOwnProperty.call(consumption[category], key)
    ) {
      const value = consumption[category]![key];
      if (
        value === undefined ||
        value === "" ||
        value === null ||
        Number.isNaN(value)
      ) {
        delete consumption[category]![key];
      }
    }
  });

  if (
    Object.prototype.hasOwnProperty.call(consumption, "description") &&
    (consumption.description === undefined ||
      consumption.description === "" ||
      consumption.description === null ||
      Number.isNaN(consumption.description))
  ) {
    delete consumption.description;
  }

  return consumption;
}

/**
 * Function to convert units based on user's unit system for consumption data.
 *
 * @param {Consumption} consumption - The consumption data to convert units for.
 * @param {"metric" | "imperial"} userUnitSystem - The user's unit system (metric or imperial).
 * @return {Consumption} The consumption data with units converted based on the user's unit system.
 */
function convertUnits(
  consumption: Consumption,
  userUnitSystem: "metric" | "imperial",
): Consumption {
  const valueUserUnit = getConsumptionUnit(
    consumption,
    userUnitSystem,
  ).userUnit;
  consumption.value = convertUnit(
    consumption.value,
    valueUserUnit,
    "metric",
  ).quantity;

  /**
   * Specific for transportation
   */
  if (
    consumption.transportation &&
    consumption.transportation.fuelConsumption
  ) {
    let fuelConsumptionUserUnit =
      userUnitSystem === "metric" ? "L/100km" : "mpg";
    if (
      ["electricCar", "electricBike"].includes(
        consumption.transportation.transportationType,
      )
    ) {
      fuelConsumptionUserUnit =
        userUnitSystem === "metric" ? "kWh/100km" : "mi/kWh";
    }
    consumption.transportation.fuelConsumption = convertUnit(
      consumption.transportation.fuelConsumption,
      fuelConsumptionUserUnit as "L/100km" | "mpg" | "kWh/100km" | "mi/kWh",
      "metric",
    ).quantity;
  }
  return consumption;
}

/**
 * Adds or edits a consumption entry in the database based on user input.
 *
 * @param {Consumption} consumption - The consumption object to add or edit.
 * @param {ConsumptionCategory} category - The category of the consumption object.
 * @param {User} user - The user object associated with the consumption.
 * @param {"metric" | "imperial"} userUnitSystem - The unit system used by the user.
 * @param {string} [consumptionId] - The optional ID of the consumption entry.
 * @return {Promise<{ success: boolean }>} An object indicating the success of the operation.
 */
export const addEditConsumption = async (
  consumption: Consumption,
  category: ConsumptionCategory,
  user: User,
  userUnitSystem: "metric" | "imperial",
  consumptionId?: string,
): Promise<{ success: boolean }> => {
  let success = false;
  consumption = removeInvalidValues(consumption, category);
  consumption = convertUnits(consumption, userUnitSystem);

  if (user) {
    const consumptionRef = collection(
      firestore,
      FirebaseConstants.collections.users.name,
      user.uid,
      FirebaseConstants.collections.users.consumptions.name,
    );
    try {
      if (consumptionId) {
        const docRef = doc(consumptionRef, consumptionId);
        await setDoc(docRef, consumption);
      } else {
        await addDoc(consumptionRef, consumption);
      }
      success = true;
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  } else {
    throw new Error("User is not logged in.");
  }

  return { success };
};
