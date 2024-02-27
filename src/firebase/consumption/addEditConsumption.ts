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
import firebaseApp from "../config";
import { FirebaseConstants } from "../firebase-constants";

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
    data: Consumption,
    category: ConsumptionCategory,
    user: User,
    consumptionId?: string,
) => {
    let success = false;
    data = removeInvalidValues(data, category);
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
                await setDoc(docRef, data);
            } else {
                await addDoc(consumptionRef, data);
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
