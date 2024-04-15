import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { Consumption } from "@/models/firestore/consumption/consumption";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
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
    consumption: Consumption,
    category: ConsumptionCategory,
) {
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
            consumption.hasOwnProperty(category) &&
            consumption[category]?.hasOwnProperty(key)
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
        consumption.hasOwnProperty("description") &&
        (consumption.description === undefined ||
            consumption.description === "" ||
            consumption.description === null ||
            Number.isNaN(consumption.description))
    ) {
        delete consumption.description;
    }

    return consumption;
}

export const addEditConsumption = async (
    consumption: Consumption,
    category: ConsumptionCategory,
    user: User,
    consumptionId?: string,
) => {
    let success = false;
    consumption = removeInvalidValues(consumption, category);
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
