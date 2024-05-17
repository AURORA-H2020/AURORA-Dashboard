"use client";

import {
    useFetchUserConsumptionSummaries,
    useFetchUserCountryData,
    useFetchUserData,
} from "@/firebase/firebaseHooks";
import { ConsumptionSummary } from "@/models/firestore/consumption-summary/consumption-summary";
import { Country } from "@/models/firestore/country/country";
import { User as FirebaseUser } from "@/models/firestore/user/user";
import React, { createContext, useContext } from "react";
import { useAuthContext } from "./AuthContext";

interface FirebaseDataContextValue {
    userData: FirebaseUser | null;
    isLoadingUserData: boolean;
    userConsumptionSummaries: ConsumptionSummary[];
    userCountryData: Country | null;
    // userConsumptions: ConsumptionWithID[];
    // userRecurringConsumptions: RecurringConsumptionWithID[];
}

const FirebaseDataContext = createContext<FirebaseDataContextValue | undefined>(
    undefined,
);

/**
 * Renders a FirebaseDataProvider component that wraps the provided children and provides access to Firebase data.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The children to be wrapped by the FirebaseDataProvider.
 * @return {React.FC} The FirebaseDataProvider component.
 */
export const FirebaseDataProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const { user, loading } = useAuthContext();

    const { userData, isLoadingUserData } = useFetchUserData(user, loading);

    const userConsumptionSummaries = useFetchUserConsumptionSummaries(user);

    const { userCountryData } = useFetchUserCountryData(user, userData);

    /* const userConsumptions = useFetchUserConsumptions({ user: user })?.docs.map(
        (doc) => ({
            ...(doc.data() as Consumption),
            id: doc.id,
        }),
    ) as ConsumptionWithID[];

    const userRecurringConsumptions = useFetchUserRecurringConsumptions({
        user: user,
    })?.docs.map((doc) => ({
        ...(doc.data() as RecurringConsumption),
        id: doc.id,
    })) as RecurringConsumptionWithID[]; */

    return (
        <FirebaseDataContext.Provider
            value={{
                userData,
                isLoadingUserData,
                userConsumptionSummaries,
                userCountryData,
                // userConsumptions,
                // userRecurringConsumptions,
            }}
        >
            {children}
        </FirebaseDataContext.Provider>
    );
};

/**
 * Returns the Firebase data from the FirebaseDataContext.
 *
 * @return {FirebaseDataContextValue} The Firebase data from the context.
 * @throws {Error} If the useFirebaseData is not used within a FirebaseDataProvider.
 */
export const useFirebaseData = (): FirebaseDataContextValue => {
    const context = useContext(FirebaseDataContext);
    if (context === undefined) {
        throw new Error(
            "useFirebaseData must be used within a FirebaseDataProvider",
        );
    }
    return context;
};
