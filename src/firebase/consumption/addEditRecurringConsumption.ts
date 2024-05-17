import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { convertUnit } from "@/lib/utilities";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { RecurringConsumption } from "@/models/firestore/recurring-consumption/recurring-consumption";
import { User } from "firebase/auth";
import {
    addDoc,
    collection,
    doc,
    getFirestore,
    setDoc,
} from "firebase/firestore";

const firestore = getFirestore(firebaseApp);

/**
 * Removes invalid values from the given recurringConsumption object based on the specified category.
 *
 * @param {RecurringConsumption} recurringConsumption - The recurringConsumption object to remove invalid values from.
 * @param {ConsumptionCategory} category - The category to filter the recurringConsumption object by.
 * @return {RecurringConsumption} - The updated recurringConsumption object with invalid values removed.
 */
function removeInvalidValues(
    recurringConsumption: RecurringConsumption,
    category: ConsumptionCategory,
): RecurringConsumption {
    const transportationKeys = [
        "privateVehicleOccupancy",
        "publicVehicleOccupancy",
        "fuelConsumption",
    ];
    transportationKeys.forEach((key) => {
        if (
            recurringConsumption.hasOwnProperty(category) &&
            recurringConsumption[category]?.hasOwnProperty(key)
        ) {
            const value = recurringConsumption[category]![key];
            if (
                value === undefined ||
                value === "" ||
                value === null ||
                Number.isNaN(value)
            ) {
                delete recurringConsumption[category]![key];
            }
        }
    });

    const frequencyKeys = ["weekdays", "dayOfMonth"];
    frequencyKeys.forEach((key) => {
        if (
            recurringConsumption.hasOwnProperty("frequency") &&
            recurringConsumption.frequency?.hasOwnProperty(key)
        ) {
            const value = recurringConsumption.frequency[key];
            if (
                value === undefined ||
                value === "" ||
                value?.length < 1 ||
                value === null ||
                Number.isNaN(value)
            ) {
                delete recurringConsumption.frequency[key];
            }
        }
    });

    if (
        recurringConsumption.hasOwnProperty("description") &&
        (recurringConsumption.description === undefined ||
            recurringConsumption.description === "" ||
            recurringConsumption.description === null ||
            Number.isNaN(recurringConsumption.description))
    ) {
        delete recurringConsumption.description;
    }

    return recurringConsumption;
}

/**
 * Converts the units of the given recurringConsumption object based on the user's unit system.
 *
 * @param {RecurringConsumption} recurringConsumption - The recurringConsumption object to convert units for.
 * @param {"metric" | "imperial"} userUnitSystem - The user's unit system (metric or imperial).
 * @return {RecurringConsumption} The recurringConsumption object with units converted based on the user's unit system.
 */
function convertUnits(
    recurringConsumption: RecurringConsumption,
    userUnitSystem: "metric" | "imperial",
): RecurringConsumption {
    if (
        recurringConsumption.transportation &&
        recurringConsumption.transportation.fuelConsumption
    ) {
        const valueUserUnit = userUnitSystem === "metric" ? "km" : "mi";
        recurringConsumption.transportation.distance = convertUnit(
            recurringConsumption.transportation?.distance,
            valueUserUnit,
            "metric",
        ).quantity;

        let fuelConsumptionUserUnit =
            userUnitSystem === "metric" ? "L/100km" : "mpg";
        if (
            ["electricCar", "electricBike"].includes(
                recurringConsumption.transportation.transportationType,
            )
        ) {
            fuelConsumptionUserUnit =
                userUnitSystem === "metric" ? "kWh/100km" : "mi/kWh";
        }
        recurringConsumption.transportation.fuelConsumption = convertUnit(
            recurringConsumption.transportation.fuelConsumption,
            fuelConsumptionUserUnit as
                | "L/100km"
                | "mpg"
                | "kWh/100km"
                | "mi/kWh",
            "metric",
        ).quantity;
    }
    return recurringConsumption;
}

/**
 * Adds or edits a recurring consumption for a user.
 *
 * @param {RecurringConsumption} recurringConsumption - The recurring consumption to add or edit.
 * @param {ConsumptionCategory} category - The category of the consumption.
 * @param {User} user - The user for whom the consumption is being added or edited.
 * @param {"metric" | "imperial"} userUnitSystem - The unit system of the user (metric or imperial).
 * @param {string} [consumptionId] - The ID of the consumption to edit (optional).
 * @throws {Error} Throws an error if the user is not logged in.
 * @return {Promise<{ success: boolean }>} Returns a promise that resolves to an object indicating the success of the operation.
 */
export const addEditRecurringConsumption = async (
    recurringConsumption: RecurringConsumption,
    category: ConsumptionCategory,
    user: User,
    userUnitSystem: "metric" | "imperial",
    consumptionId?: string,
): Promise<{ success: boolean }> => {
    let success = false;
    recurringConsumption = removeInvalidValues(recurringConsumption, category);
    recurringConsumption = convertUnits(recurringConsumption, userUnitSystem);

    if (user) {
        const consumptionRef = collection(
            firestore,
            FirebaseConstants.collections.users.name,
            user.uid,
            FirebaseConstants.collections.users.recurringConsumptions.name,
        );
        try {
            if (consumptionId) {
                const docRef = doc(consumptionRef, consumptionId);
                await setDoc(docRef, recurringConsumption);
            } else {
                await addDoc(consumptionRef, recurringConsumption);
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
