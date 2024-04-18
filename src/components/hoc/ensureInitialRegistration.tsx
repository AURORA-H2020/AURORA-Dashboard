import InitialRegistration from "@/components/app/user/initialRegistration";
import LoadingSpinner from "@/components/ui/loading";
import { useAuthContext } from "@/context/AuthContext";
import { useFirebaseData } from "@/context/FirebaseContext";

/**
 * Ensures that the user has completed the initial registration process before rendering the children components.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The components to be rendered if the user has completed the initial registration.
 * @return {React.ReactNode} The rendered children components if the user has completed the initial registration, otherwise renders the InitialRegistration component.
 */
export const EnsureInitialRegistration = ({
    children,
}: {
    children: React.ReactNode;
}): React.ReactNode => {
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
