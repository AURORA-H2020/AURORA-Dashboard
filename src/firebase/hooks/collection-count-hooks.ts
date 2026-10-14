import { User } from "firebase/auth";
import {
  collection,
  getCountFromServer,
  getFirestore,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";

const firestore = getFirestore(firebaseApp);

/**
 * Counts the documents in one of the user's subcollections. The count is
 * refreshed whenever `refreshTrigger` changes, e.g. when the currently shown
 * page of documents changes after an add or delete.
 *
 * @param {User | null} user - The user whose subcollection is counted.
 * @param {string} subcollectionName - The name of the user's subcollection.
 * @param {unknown} refreshTrigger - A value that triggers a recount when it changes.
 * @return {number} The number of documents, or 0 while unknown.
 */
export const useUserSubcollectionCount = (
  user: User | null,
  subcollectionName: string,
  refreshTrigger?: unknown,
): number => {
  const [count, setCount] = useState<number>(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshTrigger is only used to trigger a recount
  useEffect(() => {
    if (!user) return;

    let isCurrent = true;

    getCountFromServer(
      collection(
        firestore,
        FirebaseConstants.collections.users.name,
        user.uid,
        subcollectionName,
      ),
    )
      .then((snapshot) => {
        if (isCurrent) setCount(snapshot.data().count);
      })
      .catch((error) => {
        console.error(`Error counting ${subcollectionName}: `, error);
      });

    return () => {
      isCurrent = false;
    };
  }, [user, subcollectionName, refreshTrigger]);

  return count;
};
