import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { convertUnit } from "@/lib/utilities";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { RecurringConsumption } from "@/models/firestore/recurring-consumption/recurring-consumption";
import { User } from "@firebase/auth";
import {
    addDoc,
    collection,
    doc,
    getFirestore,
    setDoc,
} from "firebase/firestore";

// Initialize Firestore
const firestore = getFirestore(firebaseApp);

function removeInvalidValues(
    recurringConsumption: RecurringConsumption,
    category: ConsumptionCategory,
) {
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

function convertUnits(
    recurringConsumption: RecurringConsumption,
    userUnitSystem: "metric" | "imperial",
) {
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

export const addEditRecurringConsumption = async (
    recurringConsumption: RecurringConsumption,
    category: ConsumptionCategory,
    user: User,
    userUnitSystem: "metric" | "imperial",
    consumptionId?: string,
) => {
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
