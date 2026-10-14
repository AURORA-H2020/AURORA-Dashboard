import {
  fetchAndActivate,
  getRemoteConfig,
  getValue,
} from "firebase/remote-config";
import { useEffect, useState } from "react";
import { firebaseApp } from "@/firebase/config";

/**
 * Fetches the latest legal documents version from Firebase Remote Config.
 * If fetching fails, the last activated (cached) value is used. If no value is
 * available at all, the version is undefined.
 *
 * @return {{ latestLegalDocumentsVersion: number | undefined, isLoadingLatestLegalDocumentsVersion: boolean }} The latest version and a boolean indicating whether it is still loading.
 */
export const useLatestLegalDocumentsVersion = (): {
  latestLegalDocumentsVersion: number | undefined;
  isLoadingLatestLegalDocumentsVersion: boolean;
} => {
  const [latestLegalDocumentsVersion, setLatestLegalDocumentsVersion] =
    useState<number | undefined>();
  const [
    isLoadingLatestLegalDocumentsVersion,
    setIsLoadingLatestLegalDocumentsVersion,
  ] = useState<boolean>(true);

  useEffect(() => {
    const remoteConfig = getRemoteConfig(firebaseApp);

    fetchAndActivate(remoteConfig)
      .catch((error) => {
        console.error("Error fetching remote config: ", error);
      })
      .finally(() => {
        const version = getValue(
          remoteConfig,
          "latestLegalDocumentsVersion",
        ).asNumber();
        setLatestLegalDocumentsVersion(version > 0 ? version : undefined);
        setIsLoadingLatestLegalDocumentsVersion(false);
      });
  }, []);

  return { latestLegalDocumentsVersion, isLoadingLatestLegalDocumentsVersion };
};
