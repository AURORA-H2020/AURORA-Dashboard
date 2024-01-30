import { Button } from "@/components/ui/button";
import signIn from "@/firebase/auth/authentication";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { faApple } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Renders a sign-in form and handles sign-in through email, Google,
 * or Apple. On successful sign-in, displays a success toast and
 * redirects to the account page.
 */
function AuthenticateWithApple({ isSignIn = true }: { isSignIn?: boolean }) {
    const router = useRouter();

    /**
     * Function to handle post sign in actions.
     */
    const postSignIn = () => {
        toast.success("Welcome to AURORA!");
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
        }
    }

    return (
        <Button
            className="w-full my-1"
            onClick={() => handleAuthenticateWithApple()}
        >
            <FontAwesomeIcon icon={faApple} className="mr-2" />
            {isSignIn ? "Sign in " : "Sign up "}
            with Apple
        </Button>
    );
}

export default AuthenticateWithApple;
