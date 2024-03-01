import { firebaseApp } from "@/firebase/config";
import {
    ConsumptionWithID,
    RecurringConsumptionWithID,
} from "@/models/extensions";
import { ConsumptionSummary } from "@/models/firestore/consumption-summary/consumption-summary";
import { Consumption } from "@/models/firestore/consumption/consumption";
import { RecurringConsumption } from "@/models/firestore/recurring-consumption/recurring-consumption";
import { User as FirebaseUser } from "@/models/firestore/user/user";
import { User } from "firebase/auth";
import {
    DocumentData,
    QuerySnapshot,
    collection,
    doc,
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
import { FirebaseConstants } from "./firebase-constants";

const firestore = getFirestore(firebaseApp);

export const useFetchUserData = (
    user: User | null,
    loading: boolean,
    router,
) => {
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
                console.log("User document does not exist");
                setIsLoadingUserData(false);
            }
        });

        return unsubscribe;
    }, [user, router, loading]);

    return { userData, isLoadingUserData };
};

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
}) => {
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
}) => {
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

export const useFetchUserConsumptionSummaries = (user: User | null) => {
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

    user &&
        getCountFromServer(
            collection(
                firestore,
                FirebaseConstants.collections.users.name,
                user.uid,
                FirebaseConstants.collections.users.consumptions.name,
            ),
        ).then((snapshot) => setTotalConsumptions(snapshot.data().count));

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

    user &&
        getCountFromServer(
            collection(
                firestore,
                FirebaseConstants.collections.users.name,
                user.uid,
                FirebaseConstants.collections.users.recurringConsumptions.name,
            ),
        ).then((snapshot) =>
            setTotalRecurringConsumptions(snapshot.data().count),
        );

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
