import { LoadingSpinner } from "@/components/ui/loading";
import { useAuthContext } from "@/context/AuthContext";
import { useUserRoles } from "@/firebase/firebaseHooks";
import { useRouter } from "@/navigation";
import { ReactNode, useEffect } from "react";

/**
 * Higher order component (HOC) that protects an admin route.
 * If the user is not authenticated or not an admin, they will be redirected to the account page.
 * If the user is authenticated and an admin, the children will be rendered.
 * If the loading is in progress, a loading spinner will be rendered instead of the children.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to render.
 * @return {ReactNode} The rendered component.
 */
export const ProtectAdmin = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  const { user, loading } = useAuthContext();
  const { isAdmin, isAdminLoading } = useUserRoles(user?.uid);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdminLoading && !isAdmin) {
      router.push("/account");
    }
  }, [loading, isAdminLoading, isAdmin, router]);

  if (loading || isAdminLoading) {
    return <LoadingSpinner />;
  }

  if (user && isAdmin) {
    return <>{children}</>;
  }

  return <LoadingSpinner />;
};
