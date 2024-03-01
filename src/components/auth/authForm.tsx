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
import { Flex, Grid, Link } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import BorderBox from "../app/common/borderBox";
import ResetPasswordModal from "../app/user/modals/resetPasswordModal";
import { Button } from "../ui/button";

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
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                            {t("ui.auth.orContinueWith")}
                        </span>
                    </div>
                </div>
                <Grid gap="4">
                    <AuthenticateWithGoogle isSignIn={isSignIn} />
                    <AuthenticateWithApple isSignIn={isSignIn} />
                </Grid>
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
        <Flex justify="center">
            <Tabs
                defaultValue="email-signin"
                className="w-[400px] flex gap-4 flex-col"
            >
                <TabsList className="w-full">
                    <TabsTrigger value="email-signin" className="w-1/2">
                        {t("ui.auth.signIn")}
                    </TabsTrigger>
                    <TabsTrigger value="email-signup" className="w-1/2">
                        {t("ui.auth.signUp")}
                    </TabsTrigger>
                </TabsList>

                <Card>
                    <TabsContent value="email-signin">
                        <CardHeader>
                            <CardTitle>{t("ui.auth.signIn")}</CardTitle>
                            <CardDescription>
                                {t("ui.auth.signInPrompt")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col">
                            <SignInWithEmail />
                            <ResetPasswordModal>
                                <Button className="self-end p-0" variant="link">
                                    Forgot password
                                </Button>
                            </ResetPasswordModal>
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
                </Card>
                <BorderBox className="text-sm text-muted-foreground">
                    This tool was developed by the AURORA Horizon 2020 EU-funded
                    project (No. <Link href="#">101036418</Link>). Your data is
                    processed by members of the project consortium and securely
                    storedd in Google Firebase. Your data will only be used for
                    research purposes in an anonymised format and never
                    commercially without your explicit consent. You can modify,
                    download or delete your data at any time or reach out to our
                    support under{" "}
                    <Link href="mailto:app-support@aurora-h2020.eu">
                        app-support@aurora-h2020.eu
                    </Link>
                    . By proceeding you agree to AURORA&apos;s{" "}
                    <Link href="#">Terms of Service</Link>
                    and <Link href="#">Privacy Policy</Link>.
                </BorderBox>
            </Tabs>
        </Flex>
    );
};
