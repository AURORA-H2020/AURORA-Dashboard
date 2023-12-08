"use client";
import signIn from "@/firebase/auth/authentication";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AppleLoginButton } from "react-social-login-buttons";
/**
 * Renders a sign-in form and handles sign-in through email, Google,
 * or Apple. On successful sign-in, displays a success toast and
 * redirects to the account page.
 */
function AuthenticateWithApple({ isSingIn = true }: { isSingIn?: boolean }) {
    const router = useRouter();
    const { toast } = useToast();

    const postSignIn = () => {
        toast({
            title: "Successfully signed in",
            description: "Welcome back!",
        });
        router.push("/account");
    };

    async function handleAuthenticateWithApple() {
        try {
            const { result, error } = await signIn("apple");
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
        <AppleLoginButton onClick={() => handleAuthenticateWithApple()}>
            {isSingIn ? "Sign in " : "Sign up "}
            with Apple
        </AppleLoginButton>
    );
}

export default AuthenticateWithApple;
