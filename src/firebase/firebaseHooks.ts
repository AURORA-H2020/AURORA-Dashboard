import firebase_app from "@/firebase/config";
import {
    ConsumptionWithID,
    RecurringConsumptionWithID,
} from "@/models/extensions";
import { ConsumptionSummary } from "@/models/firestore/consumption-summary/consumption-summary";
import { Consumption } from "@/models/firestore/consumption/consumption";
import { User as FirebaseUser } from "@/models/firestore/user/user";
import { User } from "firebase/auth";
import { collection, doc, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FirebaseConstants } from "./firebase-constants";
import { RecurringConsumption } from "@/models/firestore/recurring-consumption/recurring-consumption";

const firestore = getFirestore(firebase_app);

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
                console.log("No such document!");
            }
        });

        return unsubscribe;
    }, [user, router, loading]);

    return { userData, isLoadingUserData };
};

export const useFetchUserConsumptions = (user: User | null) => {
    const [userConsumptions, setUserConsumptions] = useState<
        ConsumptionWithID[]
    >([]);

    useEffect(() => {
        if (!user) return;

        const collectionRef = collection(
            firestore,
            FirebaseConstants.collections.users.name,
            user.uid,
            FirebaseConstants.collections.users.consumptions.name,
        );
        const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
            const consumptions = querySnapshot.docs.map((doc) => ({
                ...(doc.data() as Consumption),
                id: doc.id,
            }));
            setUserConsumptions(consumptions);
        });

        return unsubscribe;
    }, [user]);

    return userConsumptions;
};

export const useFetchUserRecurringConsumptions = (user: User | null) => {
    const [userRecurringConsumptions, setUserRecurringConsumptions] = useState<
        RecurringConsumptionWithID[]
    >([]);

    useEffect(() => {
        if (!user) return;

        const collectionRef = collection(
            firestore,
            FirebaseConstants.collections.users.name,
            user.uid,
            FirebaseConstants.collections.users.recurringConsumptions.name,
        );
        const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
            const recurringConsumptions = querySnapshot.docs.map((doc) => ({
                ...(doc.data() as RecurringConsumption),
                id: doc.id,
            }));
            setUserRecurringConsumptions(recurringConsumptions);
        });

        return unsubscribe;
    }, [user]);

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
