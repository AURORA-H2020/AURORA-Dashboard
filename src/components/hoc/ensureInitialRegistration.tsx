import InitialRegistration from "@/components/app/user/initialRegistration";
import LoadingSpinner from "@/components/ui/loading";
import { useAuthContext } from "@/context/AuthContext";
import { useFirebaseData } from "@/context/FirebaseContext";

export const EnsureInitialRegistration = ({ children }) => {
    const { loading } = useAuthContext();

    const { userData, isLoadingUserData } = useFirebaseData();

    if (loading || isLoadingUserData) {
        return <LoadingSpinner />;
    }

    if (
        !userData ||
        !userData?.hasOwnProperty("country") ||
        userData?.country === undefined
    ) {
        return <InitialRegistration />;
    }

    return children;
};
