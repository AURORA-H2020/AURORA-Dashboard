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

export const useFirebaseData = () => {
    const context = useContext(FirebaseDataContext);
    if (context === undefined) {
        throw new Error(
            "useFirebaseData must be used within a FirebaseDataProvider",
        );
    }
    return context;
};
