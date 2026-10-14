"use client";

import { ReactNode } from "react";
import { UpdateConsent } from "@/components/app/user/updateConsent";
import { LoadingSpinner } from "@/components/ui/loading";
import { useLatestLegalDocumentsVersion } from "@/firebase/hooks/remote-config-hooks";
import { useAuthContext } from "@/providers/context/authContext";
import { useFirebaseData } from "@/providers/context/firebaseContext";

/**
 * Component to ensure the latest consent from the user before rendering the children.
 * If the latest legal documents version cannot be determined, the children are rendered.
 *
 * @param {ReactNode} children - The components to be rendered.
 * @return {ReactNode} The rendered children or UpdateConsent component.
 */
export const EnsureLatestConsent = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  const { user, loading } = useAuthContext();

  const { userData, isLoadingUserData } = useFirebaseData();

  const { latestLegalDocumentsVersion, isLoadingLatestLegalDocumentsVersion } =
    useLatestLegalDocumentsVersion();

  if (
    !user ||
    loading ||
    isLoadingUserData ||
    isLoadingLatestLegalDocumentsVersion
  ) {
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
