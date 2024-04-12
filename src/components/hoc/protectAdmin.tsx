import { useAuthContext } from "@/context/AuthContext";
import { useUserRoles } from "@/firebase/firebaseHooks";
import { useRouter } from "@/navigation";
import { useEffect } from "react";
import LoadingSpinner from "../ui/loading";

export const ProtectAdmin = ({ children }) => {
    const { user, loading } = useAuthContext();
    const { isAdmin, isAdminLoading } = useUserRoles(user?.uid);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAdminLoading && user && !isAdmin) {
            router.push("/account");
        }
    }, [loading, isAdminLoading, user, isAdmin, router]);

    if (loading || isAdminLoading) {
        return <LoadingSpinner />;
    }

    if (user && isAdmin) {
        return <>{children}</>;
    }

    return <LoadingSpinner />;
};
