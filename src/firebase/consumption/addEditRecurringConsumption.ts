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
import { firebaseApp } from "../config";
import { FirebaseConstants } from "../firebase-constants";

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

export const addEditRecurringConsumption = async (
    recurringConsumption: RecurringConsumption,
    category: ConsumptionCategory,
    user: User,
    consumptionId?: string,
) => {
    let success = false;
    recurringConsumption = removeInvalidValues(recurringConsumption, category);
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
