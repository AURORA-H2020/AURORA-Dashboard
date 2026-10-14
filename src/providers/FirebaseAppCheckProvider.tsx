import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { ReactNode } from "react";
import { firebaseApp } from "@/firebase/config";

/**
 * Initializes Firebase App Check with ReCaptchaEnterpriseProvider.
 */
const initializeFirebaseAppCheck = () => {
  try {
    if (process.env.NEXT_PUBLIC_USE_EMULATOR === "true") {
      Object.assign(window, {
        FIREBASE_APPCHECK_DEBUG_TOKEN:
          process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN,
      });
    }

    initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaEnterpriseProvider(
        process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_KEY as string,
      ),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    console.error("Failed to initialize Firebase App Check:", error);
  }
};

// Initialize App Check when this module loads in the browser, so it is active
// before any child component starts Firebase requests in its effects.
if (typeof window !== "undefined") {
  initializeFirebaseAppCheck();
}

/**
 * Ensures Firebase App Check is initialized before its children make Firebase requests.
 *
 * @param {ReactNode} children - The children nodes.
 * @return {ReactNode} The rendered children.
 */
const FirebaseAppCheckProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  return <>{children}</>;
};

export { FirebaseAppCheckProvider };
