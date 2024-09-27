import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { CountryCityWithID, CountryWithID } from "@/models/extensions";
import { User as FirebaseUser } from "@/models/firestore/user/user";
import { User } from "firebase/auth";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const firestore = getFirestore(firebaseApp);

/**
 * Fetches the user's country data from Firestore based on the provided user object and user data.
 *
 * @param {User | null} user - The user object representing the user whose data is being fetched.
 * @param {FirebaseUser | null} userData - The user data object containing the country information.
 * @return {{ userCountryData: CountryWithID | null, isLoadingUserCountryData: boolean }} An object containing the fetched user country data and a boolean indicating whether the data is currently being loaded.
 */
export const useFetchUserCountryData = (
  user: User | null,
  userData: FirebaseUser | null,
): {
  userCountryData: CountryWithID | null;
  isLoadingUserCountryData: boolean;
} => {
  const [userCountryData, setUserCountryData] = useState<CountryWithID | null>(
    null,
  );

  const [isLoadingUserCountryData, setIsLoadingUserCountryData] =
    useState<boolean>(true);

  useEffect(() => {
    if (!user || !userData?.country) return;

    const docRef = doc(
      firestore,
      FirebaseConstants.collections.countries.name,
      userData.country,
    );

    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setUserCountryData({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        } as CountryWithID);
        setIsLoadingUserCountryData(false);
      } else {
        console.error("Country document does not exist");
        setIsLoadingUserCountryData(false);
      }
    });

    return unsubscribe;
  }, [user, userData?.country]);

  return { userCountryData, isLoadingUserCountryData };
};

/**
 * Fetches the user's city data from Firestore based on the provided user object and user data.
 *
 * @param {User | null} user - The user object representing the user whose data is being fetched.
 * @param {FirebaseUser | null} userData - The user data object containing the country information.
 * @return {{ userCityData: CountryCityWithID | null, isLoadingUserCityData: boolean }} An object containing the fetched user country data and a boolean indicating whether the data is currently being loaded.
 */
export const useFetchUserCityData = (
  user: User | null,
  userData: FirebaseUser | null,
): {
  userCityData: CountryCityWithID | null;
  isLoadingUserCityData: boolean;
} => {
  const [userCityData, setUserCityData] = useState<CountryCityWithID | null>(
    null,
  );

  const [isLoadingUserCityData, setIsLoadingUserCityData] =
    useState<boolean>(true);

  useEffect(() => {
    if (!user || !userData?.country || !userData?.city) return;

    const docRef = doc(
      firestore,
      FirebaseConstants.collections.countries.name,
      userData.country,
      FirebaseConstants.collections.countries.cities.name,
      userData.city,
    );

    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setUserCityData({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        } as CountryCityWithID);
        setIsLoadingUserCityData(false);
      } else {
        console.error("City document does not exist");
        setIsLoadingUserCityData(false);
      }
    });

    return unsubscribe;
  }, [user, userData?.country, userData?.city]);

  return { userCityData, isLoadingUserCityData };
};
