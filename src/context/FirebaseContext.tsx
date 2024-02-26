import {
    useFetchUserConsumptionSummaries,
    useFetchUserConsumptions,
    useFetchUserData,
} from "@/firebase/firebaseHooks";
import { ConsumptionWithID } from "@/models/extensions";
import { ConsumptionSummary } from "@/models/firestore/consumption-summary/consumption-summary";
import { User as FirebaseUser } from "@/models/firestore/user/user";
import { useRouter } from "@/navigation";
import { User } from "firebase/auth";
import React, { createContext, useContext } from "react";
import { useAuthContext } from "./AuthContext";

interface FirebaseDataContextValue {
    userData: FirebaseUser | null;
    isLoadingUserData: boolean;
    userConsumptions: ConsumptionWithID[];
    userConsumptionSummaries: ConsumptionSummary[];
}

const FirebaseDataContext = createContext<FirebaseDataContextValue | undefined>(
    undefined,
);

export const FirebaseDataProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const { user, loading } = useAuthContext() as {
        user: User;
        loading: boolean;
    };

    const router = useRouter();
    const { userData, isLoadingUserData } = useFetchUserData(
        user,
        loading,
        router,
    );
    const userConsumptions = useFetchUserConsumptions(user);

    const userConsumptionSummaries = useFetchUserConsumptionSummaries(user);

    return (
        <FirebaseDataContext.Provider
            value={{
                userData,
                isLoadingUserData,
                userConsumptions,
                userConsumptionSummaries,
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
