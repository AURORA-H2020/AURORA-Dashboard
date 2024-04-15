import { useAuthContext } from "@/context/AuthContext";
import { AuthForm } from "@/components/auth/authForm";
import LoadingSpinner from "@/components/ui/loading";

export const ProtectAccount = ({ children }) => {
    const { user, loading } = useAuthContext();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (user) {
        return children;
    }

    return <AuthForm />;
};
