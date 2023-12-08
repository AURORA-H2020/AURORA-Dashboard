"use client";
import authenticate from "@/firebase/auth/authentication";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { GoogleLoginButton } from "react-social-login-buttons";

/**
 * Renders a sign-in form and handles sign-in through email, Google,
 * or Apple. On successful sign-in, displays a success toast and
 * redirects to the account page.
 */
function AuthenticateWithGoogle({ isSingIn = true }: { isSingIn?: boolean }) {
    const router = useRouter();
    const { toast } = useToast();

    const postSignIn = () => {
        toast({
            title: "Successfully signed in",
            description: "Welcome back!",
        });
        router.push("/account");
    };

    const handleAuthenticateWithGoogle = async () => {
        try {
            const { result, error } = await authenticate("google");
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
        <GoogleLoginButton onClick={() => handleAuthenticateWithGoogle()}>
            {isSingIn ? "Sign in " : "Sign up "}
            with Google
        </GoogleLoginButton>
    );
}

export default AuthenticateWithGoogle;
