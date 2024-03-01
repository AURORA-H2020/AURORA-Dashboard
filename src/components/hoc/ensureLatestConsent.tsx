"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useFirebaseData } from "@/context/FirebaseContext";
import { firebaseApp } from "@/firebase/config";
import {
    fetchAndActivate,
    getRemoteConfig,
    getValue,
} from "firebase/remote-config";
import { useEffect, useState } from "react";
import UpdateConsent from "../app/user/updateConsent";
import LoadingSpinner from "../ui/loading";

export const EnsureLatestConsent = ({ children }) => {
    const remoteConfig = getRemoteConfig(firebaseApp);
    const { user, loading } = useAuthContext();

    const { userData, isLoadingUserData } = useFirebaseData();

    const [latestLegalDocumentsVersion, setLatestLegalDocumentsVersion] =
        useState<number | undefined>();

    useEffect(() => {
        fetchAndActivate(remoteConfig).then(() => {
            const version = getValue(
                remoteConfig,
                "latestLegalDocumentsVersion",
            ).asNumber();
            setLatestLegalDocumentsVersion(version);
        });
    }, [remoteConfig]);

    if (!user || loading || isLoadingUserData) {
        return <LoadingSpinner />;
    }

    if (
        latestLegalDocumentsVersion &&
        userData?.acceptedLegalDocumentVersion !== latestLegalDocumentsVersion
    ) {
        return (
            <UpdateConsent
                latestLegalDocumentsVersion={latestLegalDocumentsVersion}
                user={user}
            />
        );
    }

    return children;
};
