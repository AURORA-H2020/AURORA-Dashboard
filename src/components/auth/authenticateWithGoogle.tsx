import authenticate from "@/firebase/auth/authentication";
import { useRouter } from "@/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useTranslations } from "next-intl";

/**
 * Renders a sign-in form and handles sign-in through email, Google,
 * or Apple. On successful sign-in, displays a success toast and
 * redirects to the account page.
 */
function AuthenticateWithGoogle({ isSignIn = true }: { isSignIn?: boolean }) {
    const router = useRouter();
    const t = useTranslations();

    /**
     * Function to handle post sign-in actions.
     *
     * @return {void} No return value
     */
    const postSignIn = () => {
        toast.success("Welcome to AURORA!");
        router.push("/account");
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
        }
    };

    return (
        <Button
            className="w-full my-1"
            onClick={() => handleAuthenticateWithGoogle()}
        >
            <FontAwesomeIcon icon={faGoogle} className="mr-2" />
            {isSignIn
                ? t("ui.auth.signInWithGoogle")
                : t("ui.auth.signUpWithGoogle")}
        </Button>
    );
}

export default AuthenticateWithGoogle;
