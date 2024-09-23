import { Button } from "@/components/ui/button";
import { authenticate } from "@/firebase/auth/authentication";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";
import { toast } from "sonner";

/**
 * Renders a button component for authenticating with Apple.
 *
 * @param {boolean} isSignIn - Indicates whether the user is signing in. Defaults to true.
 * @return {ReactElement} The button component for authenticating with Apple.
 */
function AuthenticateWithApple({
  isSignIn = true,
}: {
  isSignIn?: boolean;
}): ReactElement {
  const t = useTranslations();

  /**
   * Function to handle post sign in actions.
   */
  const postSignIn = () => {
    toast.success(t("toast.auth.success"));
  };

  /**
   * Handles the authentication process with Apple.
   *
   * @return {Promise<void>} A promise representing the completion of the authentication process.
   */
  async function handleAuthenticateWithApple() {
    try {
      const { error } = await authenticate("apple");
      if (error) {
        // Handle the error appropriately
        console.error(error);
        // Update state to display the error message to the user
      } else {
        postSignIn();
      }
    } catch (e) {
      // Handle or log the exception
      console.error("Error during Apple sign-in:", e);
      toast.error(t("toast.auth.error"));
    }
  }

  return (
    <Button className="w-full" onClick={() => handleAuthenticateWithApple()}>
      <FontAwesomeIcon icon={faApple} className="mr-2" />
      {isSignIn ? t("ui.auth.signInWithApple") : t("ui.auth.signUpWithApple")}
    </Button>
  );
}

export { AuthenticateWithApple };
