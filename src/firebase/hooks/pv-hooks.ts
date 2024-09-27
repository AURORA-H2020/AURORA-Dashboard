import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { PvPlantWithID, UserPvInvestmentWithID } from "@/models/extensions";
import { PvPlantData } from "@/models/firestore/pv-plants/data/pv-plant-data";
import { User } from "firebase/auth";
import {
  Timestamp,
  WhereFilterOp,
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const firestore = getFirestore(firebaseApp);

/**
 * Fetches the user's PV investments from Firestore based on the provided user object and user data.
 *
 * @param {User | null} user - The user object representing the user whose PV investments are being fetched.
 * @return {{ pvInvestments: UserPvInvestmentWithID[] | null, isLoadingPvInvestments: boolean }} An object containing the fetched user PV investments and a boolean indicating whether the data is currently being loaded.
 */
export const useFetchUserPvInvestments = (
  user: User | null,
): {
  pvInvestments: UserPvInvestmentWithID[] | null;
  isLoadingPvInvestments: boolean;
} => {
  const [pvInvestments, setPvInvestments] = useState<
    UserPvInvestmentWithID[] | null
  >(null);

  const [isLoadingPvInvestments, setIsLoadingPvInvestments] =
    useState<boolean>(true);

  useEffect(() => {
    if (!user) return;

    const collectionRef = collection(
      firestore,
      FirebaseConstants.collections.users.name,
      user.uid,
      FirebaseConstants.collections.users.pvInvestments.name,
    );

    const q = query(collectionRef, orderBy("investmentDate", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        setPvInvestments(
          querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as UserPvInvestmentWithID;
          }),
        );
        setIsLoadingPvInvestments(false);
      },
      (error) => {
        console.error("Error fetching user PV investments:", error);
        setIsLoadingPvInvestments(false);
      },
    );

    return unsubscribe;
  }, [user]);

  return { pvInvestments, isLoadingPvInvestments };
};

/**
 * Fetches the PV data for a given plant from Firestore.
 *
 * @param {string} plant - The ID of the plant for which to fetch the PV data.
 * @param {Date} [toDate] - The date up to which to fetch the PV data. If not provided, the most recent 30 documents will be fetched in descending order.
 * @return {{ pvData: PvPlantData[] | null, isLoadingPvData: boolean }} An object containing the fetched PV data and a boolean indicating whether the data is currently being loaded.
 */
export const useFetchPlantPvData = (
  plant: string | undefined,
  toDate?: Timestamp | undefined,
): { pvData: PvPlantData[] | null; isLoadingPvData: boolean } => {
  const [pvData, setPvData] = useState<PvPlantData[] | null>(null);

  const [isLoadingPvData, setIsLoadingPvData] = useState<boolean>(true);

  useEffect(() => {
    if (!plant) return;
    const collectionRef = collection(
      firestore,
      FirebaseConstants.collections.pvPlants.name,
      plant,
      FirebaseConstants.collections.pvPlants.data.name,
    );

    const q = toDate
      ? query(
          collectionRef,
          orderBy("date", "desc"),
          where("date", ">=", toDate),
        )
      : query(
          collectionRef,
          orderBy("date", "desc"), // Sort by date in descending order
          limit(30), // Limit to 30 documents
        );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        setPvData(querySnapshot.docs.map((doc) => doc.data() as PvPlantData));
        setIsLoadingPvData(false);
      },
      (error) => {
        console.error("Error fetching PV data:", error);
        setIsLoadingPvData(false);
      },
    );

    return unsubscribe;
  }, [plant, toDate]);

  return { pvData, isLoadingPvData };
};

/**
 * Fetches the user's city's PV data from Firestore based on the provided user object and user data.
 *
 * @param {User | null} user - The user object representing the user whose data is being fetched.
 * @param {FirebaseUser | null} userData - The user data object containing the country information.
 * @return {{ pvData: CountryCityPvData[] | null, isLoadingPvData: boolean }} An object containing the fetched user country data and a boolean indicating whether the data is currently being loaded.
 */
export const useFetchPvPlants = (
  city?: string,
  country?: string,
): { pvPlants: PvPlantWithID[] | null; isLoadingPvPlants: boolean } => {
  const [pvPlants, setPvPlants] = useState<PvPlantWithID[] | null>(null);

  const [isLoadingPvPlants, setIsLoadingPvPlants] = useState<boolean>(true);

  useEffect(() => {
    const collectionRef = collection(
      firestore,
      FirebaseConstants.collections.pvPlants.name,
    );

    let q = query(collectionRef);

    const addWhereClause = (
      field: string,
      operator: WhereFilterOp,
      value: string,
    ) => {
      q = query(q, where(field, operator, value));
    };

    if (city) {
      addWhereClause("city", "==", city);
    }

    if (country) {
      addWhereClause("country", "==", country);
    }

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        setPvPlants(
          querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as PvPlantWithID;
          }),
        );
        setIsLoadingPvPlants(false);
      },
      (error) => {
        console.error("Error fetching PV data:", error);
        setIsLoadingPvPlants(false);
      },
    );

    return unsubscribe;
  }, [city, country]);

  return { pvPlants, isLoadingPvPlants };
};
