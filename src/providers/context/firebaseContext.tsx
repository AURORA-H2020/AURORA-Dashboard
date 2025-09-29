"use client";

import { useFetchUserConsumptionSummaries } from "@/firebase/hooks/consumption-hooks";
import {
  useFetchUserCityData,
  useFetchUserCountryData,
} from "@/firebase/hooks/location-hooks";
import {
  useFetchPvPlants,
  useFetchUserPvInvestments,
} from "@/firebase/hooks/pv-hooks";
import { useFetchUserData } from "@/firebase/hooks/user-hooks";
import {
  CountryCityWithID,
  CountryWithID,
  PvPlantWithID,
  UserPvInvestmentWithID,
} from "@/models/extensions";
import { ConsumptionSummary } from "@/models/firestore/consumption-summary/consumption-summary";
import { User as FirebaseUser } from "@/models/firestore/user/user";
import { FC, ReactNode, createContext, useContext } from "react";
import { useAuthContext } from "./authContext";

interface FirebaseDataContextValue {
  userData: FirebaseUser | null;
  isLoadingUserData: boolean;
  userConsumptionSummaries: ConsumptionSummary[];
  userCountryData: CountryWithID | null;
  isLoadingUserCountryData: boolean;
  userCityData: CountryCityWithID | null;
  isLoadingUserCityData: boolean;
  pvInvestments: UserPvInvestmentWithID[] | null;
  isLoadingPvInvestments: boolean;
  pvPlants: PvPlantWithID[];
  isLoadingPvPlants: boolean;
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
 * @param {ReactNode} props.children - The children to be wrapped by the FirebaseDataProvider.
 * @return {FC} The FirebaseDataProvider component.
 */
export const FirebaseDataProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { user, loading } = useAuthContext();

  const { userData, isLoadingUserData } = useFetchUserData(user, loading);

  const userConsumptionSummaries = useFetchUserConsumptionSummaries(user);

  const { userCountryData, isLoadingUserCountryData } = useFetchUserCountryData(
    user,
    userData,
  );

  const { userCityData, isLoadingUserCityData } = useFetchUserCityData(
    user,
    userData,
  );

  const { pvInvestments, isLoadingPvInvestments } =
    useFetchUserPvInvestments(user);

  const { pvPlants, isLoadingPvPlants } = useFetchPvPlants();

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
        isLoadingUserCountryData,
        userCityData,
        isLoadingUserCityData,
        pvInvestments,
        isLoadingPvInvestments,
        pvPlants,
        isLoadingPvPlants,
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
