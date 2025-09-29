import { AuthForm } from "@/components/auth/authForm";
import { LoadingSpinner } from "@/components/ui/loading";
import { useAuthContext } from "@/providers/context/authContext";
import { ReactNode } from "react";

/**
 * Higher order component (HOC) that protects an account based route.
 * If the user is not authenticated, the user will be redirected to the
 * authForm. If the user is authenticated, the children will be rendered.
 * If the loading is in progress, a spinner will be rendered instead of the children.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to render.
 * @return {ReactNode} The rendered component.
 */
export const ProtectAccount = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  const { user, loading } = useAuthContext();

  // If the user is not authenticated and the loading is not in progress,
  // render the auth form instead of the children.
  if (!user && !loading) {
    return <AuthForm />;
  }

  // If the loading is in progress, render a spinner instead of the children.
  if (loading) {
    return <LoadingSpinner />;
  }

  // If the user is authenticated, render the children.
  return children;
};
