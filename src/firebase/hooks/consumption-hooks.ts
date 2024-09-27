import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import {
  ConsumptionWithID,
  RecurringConsumptionWithID,
} from "@/models/extensions";
import { ConsumptionSummary } from "@/models/firestore/consumption-summary/consumption-summary";
import { Consumption } from "@/models/firestore/consumption/consumption";
import { RecurringConsumption } from "@/models/firestore/recurring-consumption/recurring-consumption";
import { User } from "firebase/auth";
import {
  DocumentData,
  QuerySnapshot,
  collection,
  endBefore,
  getCountFromServer,
  getFirestore,
  limit,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const firestore = getFirestore(firebaseApp);

/**
 * Fetches user consumptions from Firestore based on the provided parameters.
 *
 * @param {Object} options - The options for fetching user consumptions.
 * @param {User | null} options.user - The user object.
 * @param {number} [options.pageSize=5] - The number of consumptions to fetch per page.
 * @param {DocumentData | undefined} [options.lastDoc=undefined] - The last document of the previous page.
 * @param {DocumentData | undefined} [options.firstDoc=undefined] - The first document of the next page.
 * @param {"createdAt" | "value"} [options.orderByValue="createdAt"] - The field to order the consumptions by.
 * @return {QuerySnapshot<unknown, DocumentData> | undefined} The user consumptions query snapshot.
 */
export const useFetchUserConsumptions = ({
  user,
  pageSize = 5,
  lastDoc = undefined,
  firstDoc = undefined,
  orderByValue = "createdAt",
}: {
  user: User | null;
  pageSize?: number;
  lastDoc?: DocumentData | undefined;
  firstDoc?: DocumentData | undefined;
  orderByValue?: "createdAt" | "value";
}): QuerySnapshot<unknown, DocumentData> | undefined => {
  const [userConsumptions, setUserConsumptions] =
    useState<QuerySnapshot<unknown, DocumentData>>();

  useEffect(() => {
    if (!user) return;

    const collectionRef = collection(
      firestore,
      FirebaseConstants.collections.users.name,
      user.uid,
      FirebaseConstants.collections.users.consumptions.name,
    );

    let consumptionQuery;

    if (lastDoc) {
      consumptionQuery = query(
        collectionRef,
        orderBy(orderByValue, "desc"),
        startAfter(lastDoc),
        limit(pageSize),
      );
    } else if (firstDoc) {
      consumptionQuery = query(
        collectionRef,
        orderBy(orderByValue, "desc"),
        endBefore(firstDoc),
        limitToLast(pageSize),
      );
    } else {
      consumptionQuery = query(
        collectionRef,
        orderBy(orderByValue, "desc"),
        limit(pageSize),
      );
    }

    const unsubscribe = onSnapshot(consumptionQuery, (querySnapshot) => {
      setUserConsumptions(querySnapshot);
    });

    return unsubscribe;
  }, [lastDoc, orderByValue, pageSize, firstDoc, user]);

  return userConsumptions;
};

/**
 * Fetches user recurring consumptions from Firestore based on the provided parameters.
 *
 * @param {User | null} user - The user object.
 * @param {number} [pageSize=5] - The number of consumptions to fetch per page.
 * @param {DocumentData | undefined} [lastDoc=undefined] - The last document of the previous page.
 * @param {DocumentData | undefined} [firstDoc=undefined] - The first document of the next page.
 * @param {"createdAt" | "frequency"} [orderByValue="createdAt"] - The field to order the consumptions by.
 * @return {QuerySnapshot<unknown, DocumentData> | undefined} The user recurring consumptions query snapshot.
 */
export const useFetchUserRecurringConsumptions = ({
  user,
  pageSize = 5,
  lastDoc = undefined,
  firstDoc = undefined,
  orderByValue = "createdAt",
}: {
  user: User | null;
  pageSize?: number;
  lastDoc?: DocumentData | undefined;
  firstDoc?: DocumentData | undefined;
  orderByValue?: "createdAt" | "frequency";
}): QuerySnapshot<unknown, DocumentData> | undefined => {
  const [userRecurringConsumptions, setUserRecurringConsumptions] =
    useState<QuerySnapshot<unknown, DocumentData>>();

  useEffect(() => {
    if (!user) return;

    const collectionRef = collection(
      firestore,
      FirebaseConstants.collections.users.name,
      user.uid,
      FirebaseConstants.collections.users.recurringConsumptions.name,
    );
    let recurringConsumptionQuery;

    if (lastDoc) {
      recurringConsumptionQuery = query(
        collectionRef,
        orderBy(orderByValue, "desc"),
        startAfter(lastDoc),
        limit(pageSize),
      );
    } else if (firstDoc) {
      recurringConsumptionQuery = query(
        collectionRef,
        orderBy(orderByValue, "desc"),
        endBefore(firstDoc),
        limitToLast(pageSize),
      );
    } else {
      recurringConsumptionQuery = query(
        collectionRef,
        orderBy(orderByValue, "desc"),
        limit(pageSize),
      );
    }

    const unsubscribe = onSnapshot(
      recurringConsumptionQuery,
      (querySnapshot) => {
        setUserRecurringConsumptions(querySnapshot);
      },
    );

    return unsubscribe;
  }, [firstDoc, lastDoc, orderByValue, pageSize, user]);

  return userRecurringConsumptions;
};

/**
 * Fetches the consumption summaries for a given user from Firestore.
 *
 * @param {User | null} user - The user object representing the user whose consumption summaries are being fetched.
 * @return {ConsumptionSummary[]} An array of consumption summaries for the user.
 */
export const useFetchUserConsumptionSummaries = (
  user: User | null,
): ConsumptionSummary[] => {
  const [userConsumptionSummaries, setUserConsumptionSummaries] = useState<
    ConsumptionSummary[]
  >([]);

  useEffect(() => {
    if (!user) return;

    const collectionRef = collection(
      firestore,
      FirebaseConstants.collections.users.name,
      user.uid,
      FirebaseConstants.collections.users.consumptionSummaries.name,
    );

    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const fetchedSummaries = querySnapshot.docs.map(
        (doc) => doc.data() as ConsumptionSummary,
      );

      setUserConsumptionSummaries(fetchedSummaries);
    });

    return unsubscribe;
  }, [user]);

  return userConsumptionSummaries;
};

/**
 * Returns an object containing functions and data related to paginated consumptions for a given user.
 *
 * @param {Object} options - The options for paginated consumptions.
 * @param {User | null} options.user - The user object.
 * @param {number} [options.pageSize=5] - The number of consumptions to fetch per page.
 * @return {Object} An object containing the following properties:
 *  - fetchNextPage: A function to fetch the next page of consumptions.
 *  - fetchPreviousPage: A function to fetch the previous page of consumptions.
 *  - consumptionPage: An array of consumption objects for the current page.
 *  - maxPage: The maximum number of pages of consumptions.
 *  - currentPage: The current page number.
 *  - onOrderChange: A function to change the order of consumptions.
 *  - orderBy: The field to order the consumptions by.
 *  - totalConsumptions: The total number of consumptions for the user.
 */
export const usePaginatedConsumptions = ({
  user,
  pageSize = 5,
}: {
  user: User | null;
  pageSize: number;
}) => {
  const [lastDoc, setLastDoc] = useState<any>(undefined);
  const [firstDoc, setFirstDoc] = useState<any>(undefined);
  const [orderBy, setOrderByValue] = useState<"createdAt" | "value">(
    "createdAt",
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalConsumptions, setTotalConsumptions] = useState<number>(0);
  const maxPage = Math.ceil(totalConsumptions / pageSize);

  useEffect(() => {
    if (!user) return;
    getCountFromServer(
      collection(
        firestore,
        FirebaseConstants.collections.users.name,
        user.uid,
        FirebaseConstants.collections.users.consumptions.name,
      ),
    ).then((snapshot) => setTotalConsumptions(snapshot.data().count));
  }, [user]);

  const onOrderChange = (order: "createdAt" | "value") => {
    setLastDoc(undefined);
    setFirstDoc(undefined);
    setCurrentPage(1);
    setOrderByValue(order);
  };

  const querySnapshot = useFetchUserConsumptions({
    user: user,
    pageSize: pageSize,
    orderByValue: orderBy,
    lastDoc: lastDoc,
    firstDoc: firstDoc,
  });

  const fetchNextPage = () => {
    setCurrentPage((prev) => prev + 1);
    setFirstDoc(undefined);
    setLastDoc(querySnapshot?.docs[querySnapshot.docs.length - 1]);
  };

  const fetchPreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
    setLastDoc(undefined);
    setFirstDoc(querySnapshot?.docs[0]);
  };

  const consumptionPage = querySnapshot?.docs.map((doc) => ({
    ...(doc.data() as Consumption),
    id: doc.id,
  })) as ConsumptionWithID[];

  return {
    fetchNextPage,
    fetchPreviousPage,
    consumptionPage,
    maxPage,
    currentPage,
    onOrderChange,
    orderBy,
    totalConsumptions,
  };
};

/**
 * Hook to fetch paginated recurring consumptions of a user.
 *
 * @param {Object} options - The options for fetching recurring consumptions.
 * @param {User | null} options.user - The user object.
 * @param {number} [options.pageSize=5] - The number of recurring consumptions to fetch per page.
 *
 * @return {Object} An object with the following properties:
 * - `fetchNextPage`: A function to fetch the next page of recurring consumptions.
 * - `fetchPreviousPage`: A function to fetch the previous page of recurring consumptions.
 * - `recurringConsumptionPage`: An array of recurring consumptions in the current page.
 * - `maxPage`: The total number of pages.
 * - `currentPage`: The current page number.
 * - `onOrderChange`: A function to change the order of the recurring consumptions.
 * - `orderBy`: The current order of the recurring consumptions.
 * - `totalRecurringConsumptions`: The total number of recurring consumptions.
 */
export const usePaginatedRecurringConsumptions = ({
  user,
  pageSize = 5,
}: {
  user: User | null;
  pageSize: number;
}) => {
  const [lastDoc, setLastDoc] = useState<any>(undefined);
  const [firstDoc, setFirstDoc] = useState<any>(undefined);
  const [orderBy, setOrderByValue] = useState<"createdAt" | "frequency">(
    "createdAt",
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecurringConsumptions, setTotalRecurringConsumptions] =
    useState<number>(0);
  const maxPage = Math.ceil(totalRecurringConsumptions / pageSize);

  useEffect(() => {
    if (!user) return;

    getCountFromServer(
      collection(
        firestore,
        FirebaseConstants.collections.users.name,
        user.uid,
        FirebaseConstants.collections.users.recurringConsumptions.name,
      ),
    ).then((snapshot) => setTotalRecurringConsumptions(snapshot.data().count));
  }, [user]);

  const onOrderChange = (order: "createdAt" | "frequency") => {
    setLastDoc(undefined);
    setFirstDoc(undefined);
    setCurrentPage(1);
    setOrderByValue(order);
  };

  const querySnapshot = useFetchUserRecurringConsumptions({
    user: user,
    pageSize: pageSize,
    orderByValue: orderBy,
    lastDoc: lastDoc,
    firstDoc: firstDoc,
  });

  const fetchNextPage = () => {
    setCurrentPage((prev) => prev + 1);
    setFirstDoc(undefined);
    setLastDoc(querySnapshot?.docs[querySnapshot.docs.length - 1]);
  };

  const fetchPreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
    setLastDoc(undefined);
    setFirstDoc(querySnapshot?.docs[0]);
  };

  const recurringConsumptionPage = querySnapshot?.docs.map((doc) => ({
    ...(doc.data() as RecurringConsumption),
    id: doc.id,
  })) as RecurringConsumptionWithID[];

  return {
    fetchNextPage,
    fetchPreviousPage,
    recurringConsumptionPage,
    maxPage,
    currentPage,
    onOrderChange,
    orderBy,
    totalRecurringConsumptions,
  };
};
