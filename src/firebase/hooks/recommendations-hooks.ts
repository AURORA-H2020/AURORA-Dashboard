import { firebaseApp } from "@/firebase/config";
import { FirebaseConstants } from "@/firebase/firebase-constants";
import { RecommendationWithId } from "@/models/extensions";
import { Recommendation } from "@/models/firestore/recommendation/recommendation";
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

export const useFetchUserRecommendations = ({
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
  const [userRecommendations, setUserRecommendations] =
    useState<QuerySnapshot<unknown, DocumentData>>();

  useEffect(() => {
    if (!user) return;

    const collectionRef = collection(
      firestore,
      FirebaseConstants.collections.users.name,
      user.uid,
      FirebaseConstants.collections.users.recommendations.name,
    );

    let recommendationsQuery;

    if (lastDoc) {
      recommendationsQuery = query(
        collectionRef,
        orderBy(orderByValue, "desc"),
        startAfter(lastDoc),
        limit(pageSize),
      );
    } else if (firstDoc) {
      recommendationsQuery = query(
        collectionRef,
        orderBy(orderByValue, "desc"),
        endBefore(firstDoc),
        limitToLast(pageSize),
      );
    } else {
      recommendationsQuery = query(
        collectionRef,
        orderBy(orderByValue, "desc"),
        limit(pageSize),
      );
    }

    const unsubscribe = onSnapshot(recommendationsQuery, (querySnapshot) => {
      setUserRecommendations(querySnapshot);
    });

    return unsubscribe;
  }, [lastDoc, orderByValue, pageSize, firstDoc, user]);

  return userRecommendations;
};

export const usePaginatedRecommendations = ({
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
  const [totalRecommendations, setTotalRecommendations] = useState<number>(0);
  const maxPage = Math.ceil(totalRecommendations / pageSize);

  useEffect(() => {
    if (!user) return;
    // getCountFromServer seems broken with firebase emulator, but working in production
    if (process.env.NODE_ENV === "development") return;
    getCountFromServer(
      collection(
        firestore,
        FirebaseConstants.collections.users.name,
        user.uid,
        FirebaseConstants.collections.users.recommendations.name,
      ),
    ).then((snapshot) => setTotalRecommendations(snapshot.data().count));
  }, [user]);

  const onOrderChange = (order: "createdAt" | "value") => {
    setLastDoc(undefined);
    setFirstDoc(undefined);
    setCurrentPage(1);
    setOrderByValue(order);
  };

  const querySnapshot = useFetchUserRecommendations({
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

  const recommendationsPage = querySnapshot?.docs.map((doc) => ({
    ...(doc.data() as Recommendation),
    id: doc.id,
  })) as RecommendationWithId[];

  return {
    fetchNextPage,
    fetchPreviousPage,
    recommendationsPage,
    maxPage,
    currentPage,
    onOrderChange,
    orderBy,
    totalRecommendations,
  };
};
