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
import firebaseApp from "../config";
import { FirebaseConstants } from "../firebase-constants";

// Initialize Firestore
const firestore = getFirestore(firebaseApp);

function removeInvalidValues(
    recurringConsumption: RecurringConsumption,
    category: ConsumptionCategory,
) {
    const keysToCheck = [
        "costs",
        "districtHeatingSource",
        "privateVehicleOccupancy",
        "publicVehicleOccupancy",
        "dateOfTravelEnd",
    ];
    keysToCheck.forEach((key) => {
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
