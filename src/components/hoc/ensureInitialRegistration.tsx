import { useAuthContext } from "@/context/AuthContext";
import { useFirebaseData } from "@/context/FirebaseContext";
import LoadingSpinner from "../ui/loading";
import InitialRegistration from "../app/user/initialRegistration";

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
