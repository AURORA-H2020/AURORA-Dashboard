import { useAuthContext } from "@/context/AuthContext";
import { AuthForm } from "../auth/authForm";
import LoadingSpinner from "../ui/loading";

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
