import { Button } from "@/components/ui/button";
import { authenticate } from "@/firebase/auth/authentication";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";
import { toast } from "sonner";

/**
 * Renders a button component that handles authentication with Google.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isSignIn - Determines if the component is used for sign-in or sign-up.
 * @return {ReactElement} The rendered button component.
 */
function AuthenticateWithGoogle({
  isSignIn = true,
}: {
  isSignIn?: boolean;
}): ReactElement {
  const t = useTranslations();

  /**
   * Function to handle post sign-in actions.
   *
   * @return {void} No return value
   */
  const postSignIn = () => {
    toast.success(t("toast.auth.success"));
  };

  /**
   * Asynchronously handles authentication with Google.
   *
   * @return {void}
   */
  const handleAuthenticateWithGoogle = async () => {
    try {
      const { error } = await authenticate("google");
      if (error) {
        // Handle the error appropriately
        console.error(error);
        // Update state to display the error message to the user
      } else {
        postSignIn();
      }
    } catch (e) {
      // Handle or log the exception
      console.error("Error during Google sign-in:", e);
      toast.error(t("toast.auth.error"));
    }
  };

  return (
    <Button className="w-full" onClick={() => handleAuthenticateWithGoogle()}>
      <FontAwesomeIcon icon={faGoogle} className="mr-2" />
      {isSignIn ? t("ui.auth.signInWithGoogle") : t("ui.auth.signUpWithGoogle")}
    </Button>
  );
}

export { AuthenticateWithGoogle };
