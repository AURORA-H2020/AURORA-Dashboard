"use client";

import AuthenticateWithApple from "@/components/auth/authOptions/authenticateWithApple";
import AuthenticateWithGoogle from "@/components/auth/authOptions/authenticateWithGoogle";
import SignInWithEmail from "@/components/auth/authOptions/signInWithEmail";
import SignUpWithEmail from "@/components/auth/authOptions/signUpWithEmail";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flex } from "@radix-ui/themes";
import { useTranslations } from "next-intl";

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
    const t = useTranslations();

    return (
        <>
            <Flex direction={"column"}>
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                            {t("ui.auth.orContinueWith")}
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
export const AuthForm = () => {
    const t = useTranslations();

    return (
        <Flex justify={"center"}>
            <Card className="w-[400px]">
                <Tabs defaultValue="email-signin">
                    <TabsList className="w-full">
                        <TabsTrigger value="email-signin" className="w-1/2">
                            {t("ui.auth.signIn")}
                        </TabsTrigger>
                        <TabsTrigger value="email-signup" className="w-1/2">
                            {t("ui.auth.signUp")}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="email-signin">
                        <CardHeader>
                            <CardTitle>{t("ui.auth.signIn")}</CardTitle>
                            <CardDescription>
                                {t("ui.auth.signInPrompt")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SignInWithEmail />
                            <AuthenticationOptions isSignIn={true} />
                        </CardContent>
                    </TabsContent>

                    <TabsContent value="email-signup">
                        <CardHeader>
                            <CardTitle>{t("ui.auth.signUp")}</CardTitle>
                            <CardDescription>
                                {t("ui.auth.signUpPrompt")}
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