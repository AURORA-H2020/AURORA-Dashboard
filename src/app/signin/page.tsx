"use client";

import { Flex, Strong } from "@radix-ui/themes";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import SignInWithEmail from "@/components/auth/signInWithEmail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignUpWithEmail from "@/components/auth/signUpWithEmail";
import AuthenticateWithGoogle from "@/components/auth/authenticateWithGoogle";
import AuthenticateWithApple from "@/components/auth/authenticateWithApple";

/**
 * Renders a sign-in form and handles sign-in through email, Google,
 * or Apple. On successful sign-in, displays a success toast and
 * redirects to the account page.
 */
function SignInForm() {
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
                            <AuthenticateWithGoogle isSingIn={true} />
                            <AuthenticateWithApple isSingIn={true} />
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
                            <AuthenticateWithGoogle isSingIn={false} />
                            <AuthenticateWithApple isSingIn={false} />
                        </CardContent>
                    </TabsContent>
                </Tabs>
            </Card>
        </Flex>
    );
}

export default SignInForm;
