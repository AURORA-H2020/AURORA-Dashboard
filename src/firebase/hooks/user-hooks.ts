import { User } from "firebase/auth";
import {
  collection,
  DocumentData,
  doc,
  getFirestore,
  onSnapshot,
  QuerySnapshot,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { User as FirebaseUser } from "@/models/firestore/user/user";

const firestore = getFirestore(firebaseApp);

/**
 * Custom hook that fetches user data from Firestore based on the provided user object.
 *
 * @param {User | null} user - The user object representing the user whose data is being fetched.
 * @param {boolean} loading - A boolean indicating whether the data is currently being loaded.
 * @return {{ userData: FirebaseUser | null, isLoadingUserData: boolean }} An object containing the fetched user data and a boolean indicating whether the data is currently being loaded.
 */
export const useFetchUserData = (
  user: User | null,
  loading: boolean,
): { userData: FirebaseUser | null; isLoadingUserData: boolean } => {
  const [userData, setUserData] = useState<FirebaseUser | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState<boolean>(true);

  useEffect(() => {
    if (loading || !user) return;

    const docRef = doc(
      firestore,
      FirebaseConstants.collections.users.name,
      user.uid,
    );
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setUserData(docSnapshot.data() as FirebaseUser);
        setIsLoadingUserData(false);
      } else {
        console.error("User document does not exist");
        setIsLoadingUserData(false);
      }
    });

    return unsubscribe;
  }, [user, loading]);

  return { userData, isLoadingUserData };
};

/**
 * Custom hook that fetches user roles from Firestore based on the provided userId.
 *
 * @param {string | undefined} userId - The userId for which user roles are being fetched.
 * @return {{ isAdmin: boolean, isAdminLoading: boolean }} An object containing the user's admin status and loading state.
 */
export const useUserRoles = (
  userId: string | undefined,
): { isAdmin: boolean; isAdminLoading: boolean } => {
  // Remember which user the role belongs to, so a stale role is never used
  // while the role of a newly signed-in user is loading
  const [userRole, setUserRole] = useState<{
    userId?: string;
    isAdmin: boolean;
  }>({ isAdmin: false });

  useEffect(() => {
    if (!userId) return;

    const docRef = doc(firestore, "user-roles", userId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        setUserRole({
          userId,
          isAdmin: docSnapshot.data()?.isAdmin || false,
        });
      },
      () => {
        setUserRole({ userId, isAdmin: false });
      },
    );

    return unsubscribe;
  }, [userId]);

  if (!userId) {
    return { isAdmin: false, isAdminLoading: false };
  }

  const isAdminLoading = userRole.userId !== userId;

  return { isAdmin: !isAdminLoading && userRole.isAdmin, isAdminLoading };
};

/**
 * Fetches the blacklisted users from the Firestore database based on the provided user.
 *
 * @param {User | null} user - The currently logged-in user.
 * @return {Object} - An object containing the blacklisted users.
 */
export const useFetchBlacklistedUsers = (user: User | null) => {
  const [blacklistedUsers, setBlacklistedUsers] =
    useState<QuerySnapshot<unknown, DocumentData>>();

  useEffect(() => {
    if (!user) return;

    const collectionRef = collection(
      firestore,
      FirebaseConstants.collections.exportUserDataBlacklistedUsers.name,
    );

    const blacklistedUsersQuery = query(collectionRef);

    const unsubscribe = onSnapshot(blacklistedUsersQuery, (querySnapshot) => {
      setBlacklistedUsers(querySnapshot);
    });

    return unsubscribe;
  }, [user]);

  return { blacklistedUsers };
};
