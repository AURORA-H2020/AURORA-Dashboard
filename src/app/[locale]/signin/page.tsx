"use client";

import AuthenticateWithApple from "@/components/auth/authenticateWithApple";
import AuthenticateWithGoogle from "@/components/auth/authenticateWithGoogle";
import SignInWithEmail from "@/components/auth/signInWithEmail";
import SignUpWithEmail from "@/components/auth/signUpWithEmail";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flex } from "@radix-ui/themes";

/**
 * Renders the authentication options based on the sign-in state.
 *
 * @param {boolean} isSignIn - Indicates whether the user is signing in.
 * @return {JSX.Element} The rendered authentication options component.
 */
const AuthenticationOptions = ({
    isSignIn,
}: {
    isSignIn: boolean;
}): JSX.Element => {
    return (
        <>
            <Flex direction={"column"}>
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <AuthenticateWithGoogle isSignIn={isSignIn} />
                <AuthenticateWithApple isSignIn={isSignIn} />
            </Flex>
        </>
    );
};

/**
 * Renders a sign-in form with tabs for email sign-in and sign-up options.
 *
 * @return {JSX.Element} The sign-in form component
 */
const SignInForm = () => {
    return (
        <Flex justify={"center"}>
            <Card className="w-[400px]">
                <Tabs defaultValue="email-signin">
                    <TabsList className="w-full">
                        <TabsTrigger value="email-signin" className="w-1/2">
                            Sign In
                        </TabsTrigger>
                        <TabsTrigger value="email-signup" className="w-1/2">
                            Sign Up
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="email-signin">
                        <CardHeader>
                            <CardTitle>Sign In</CardTitle>
                            <CardDescription>
                                Sign in to your AURORA Energy Tracker account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SignInWithEmail />
                            <AuthenticationOptions isSignIn={true} />
                        </CardContent>
                    </TabsContent>

                    <TabsContent value="email-signup">
                        <CardHeader>
                            <CardTitle>Sign Up</CardTitle>
                            <CardDescription>
                                Sign up to the AURORA Energy Tracker.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SignUpWithEmail />
                            <AuthenticationOptions isSignIn={false} />
                        </CardContent>
                    </TabsContent>
                </Tabs>
            </Card>
        </Flex>
    );
};

export default SignInForm;