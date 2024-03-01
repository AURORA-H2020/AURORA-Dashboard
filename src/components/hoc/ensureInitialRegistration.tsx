import { useAuthContext } from "@/context/AuthContext";
import { useFirebaseData } from "@/context/FirebaseContext";
import InitialRegistration from "../app/user/initialRegistration";
import LoadingSpinner from "../ui/loading";

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
