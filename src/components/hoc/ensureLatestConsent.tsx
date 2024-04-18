"use client";

import UpdateConsent from "@/components/app/user/updateConsent";
import LoadingSpinner from "@/components/ui/loading";
import { useAuthContext } from "@/context/AuthContext";
import { useFirebaseData } from "@/context/FirebaseContext";
import { firebaseApp } from "@/firebase/config";
import {
    fetchAndActivate,
    getRemoteConfig,
    getValue,
} from "firebase/remote-config";
import { useEffect, useState } from "react";

/**
 * Component to ensure the latest consent from the user before rendering the children.
 *
 * @param {ReactNode} children - The components to be rendered.
 * @return {ReactNode} The rendered children or UpdateConsent component.
 */
export const EnsureLatestConsent = ({
    children,
}: {
    children: React.ReactNode;
}): React.ReactNode => {
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
