import { Button } from "@/components/ui/button";
import signIn from "@/firebase/auth/authentication";
import { useRouter } from "@/navigation";
import { toast } from "sonner";

import { faApple } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

/**
 * Renders a sign-in form and handles sign-in through email, Google,
 * or Apple. On successful sign-in, displays a success toast and
 * redirects to the account page.
 */
function AuthenticateWithApple({ isSignIn = true }: { isSignIn?: boolean }) {
    const router = useRouter();
    const t = useTranslations();

    /**
     * Function to handle post sign in actions.
     */
    const postSignIn = () => {
        toast.success(t("toast.auth.success"));
        router.push("/account");
    };

    /**
     * Handles the authentication process with Apple.
     *
     * @return {Promise<void>} A promise representing the completion of the authentication process.
     */
    async function handleAuthenticateWithApple() {
        try {
            const { error } = await signIn("apple");
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
        <Button
            className="w-full my-1"
            onClick={() => handleAuthenticateWithApple()}
        >
            <FontAwesomeIcon icon={faApple} className="mr-2" />
            {isSignIn
                ? t("ui.auth.signInWithApple")
                : t("ui.auth.signUpWithApple")}
        </Button>
    );
}

export default AuthenticateWithApple;
