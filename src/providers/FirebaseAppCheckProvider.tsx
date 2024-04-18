import { firebaseApp } from "@/firebase/config";
import {
    initializeAppCheck,
    ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { useEffect } from "react";

/**
 * Initializes Firebase App Check with ReCaptchaEnterpriseProvider.
 *
 * @param {React.ReactNode} children - The children nodes.
 * @return {React.ReactNode} The rendered children.
 */
export const FirebaseAppCheckProvider = ({
    children,
}: {
    children: React.ReactNode;
}): React.ReactNode => {
    useEffect(() => {
        try {
            if (process.env.NEXT_PUBLIC_TEST_MODE === "true") {
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
    }, []);

    return <>{children}</>;
};
