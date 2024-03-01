"use client";

import {
    useFetchUserConsumptionSummaries,
    useFetchUserConsumptions,
    useFetchUserData,
    useFetchUserRecurringConsumptions,
} from "@/firebase/firebaseHooks";
import {
    ConsumptionWithID,
    RecurringConsumptionWithID,
} from "@/models/extensions";
import { ConsumptionSummary } from "@/models/firestore/consumption-summary/consumption-summary";
import { Consumption } from "@/models/firestore/consumption/consumption";
import { RecurringConsumption } from "@/models/firestore/recurring-consumption/recurring-consumption";
import { User as FirebaseUser } from "@/models/firestore/user/user";
import { useRouter } from "@/navigation";
import React, { createContext, useContext } from "react";
import { useAuthContext } from "./AuthContext";

interface FirebaseDataContextValue {
    userData: FirebaseUser | null;
    isLoadingUserData: boolean;
    userConsumptions: ConsumptionWithID[];
    userConsumptionSummaries: ConsumptionSummary[];
    userRecurringConsumptions: RecurringConsumptionWithID[];
}

const FirebaseDataContext = createContext<FirebaseDataContextValue | undefined>(
    undefined,
);

export const FirebaseDataProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const { user, loading } = useAuthContext();

    const router = useRouter();
    const { userData, isLoadingUserData } = useFetchUserData(
        user,
        loading,
        router,
    );

    const userConsumptions = useFetchUserConsumptions({ user: user })?.docs.map(
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
    })) as RecurringConsumptionWithID[];

    const userConsumptionSummaries = useFetchUserConsumptionSummaries(user);

    return (
        <FirebaseDataContext.Provider
            value={{
                userData,
                isLoadingUserData,
                userConsumptions,
                userConsumptionSummaries,
                userRecurringConsumptions,
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
