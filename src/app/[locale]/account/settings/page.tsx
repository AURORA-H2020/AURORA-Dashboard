"use client";

import { ConsumptionTableRow } from "@/components/app/common/consumptionTableRow";
import { ChangeEmailModal } from "@/components/app/user/modals/changeEmailModal";
import { ChangePasswordModal } from "@/components/app/user/modals/changePasswordModal";
import { DeleteAccountModal } from "@/components/app/user/modals/deleteAccountModal";
import { EditUserDataModal } from "@/components/app/user/modals/editUserDataModal";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { Table, TableBody } from "@/components/ui/table";
import { useAuthContext } from "@/context/AuthContext";
import { useFirebaseData } from "@/context/FirebaseContext";
import { downloadUserData } from "@/firebase/firestore/downloadUserData";
import {
    citiesMappings,
    countriesMapping,
    externalLinks,
    unitSystems,
} from "@/lib/constants/constants";
import { Link } from "@/navigation";
import { Flex, Grid } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Renders the user settings page with profile and account information.
 *
 * @return {React.ReactNode} The user settings page component
 */
const UserSettingsPage = (): React.ReactNode => {
    const t = useTranslations();
    const { user, loading } = useAuthContext();
    const { userData } = useFirebaseData();

    const [authProvider, setAuthProvider] = useState<string | null>(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        user?.getIdTokenResult().then((idToken) => {
            setAuthProvider(idToken.signInProvider);
        });
    }, [user]);

    /**
     * Function to handle downloading user data.
     *
     * @return {Promise<void>} Resolves when user data is downloaded successfully
     */
    const downloadUserDataWrapper = async () => {
        setDownloading(true);
        try {
            await downloadUserData();
            toast.success(t("toast.dataDownload.success"));
        } catch (error) {
            // Handle the error
            console.error("Error downloading user data:", error);
            toast.error(t("toast.dataDownload.error"));
        } finally {
            setDownloading(false);
        }
    };

    if (loading || !user || !userData) return <LoadingSpinner />;

    const supportLink = new URL(externalLinks.supportWebsite);
    supportLink.search = new URLSearchParams({
        user_id: user.uid,
        country_id: userData.country,
    }).toString();

    return (
        <Grid
            columns={{
                initial: "1",
                sm: "2",
            }}
            className="gap-6 mt-6 mb-6"
        >
            <Flex direction={"column"} className="gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("app.profile.yourProfile")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                <ConsumptionTableRow
                                    label={t("app.profile.firstName")}
                                >
                                    {userData?.firstName}
                                </ConsumptionTableRow>
                                <ConsumptionTableRow
                                    label={t("app.profile.lastName")}
                                >
                                    {userData?.lastName}
                                </ConsumptionTableRow>
                                <ConsumptionTableRow
                                    label={t("app.profile.yearOfBirth")}
                                >
                                    {userData?.yearOfBirth}
                                </ConsumptionTableRow>

                                <ConsumptionTableRow
                                    label={t("app.profile.gender")}
                                >
                                    {userData.gender
                                        ? t(`gender.${userData.gender}`)
                                        : ""}
                                </ConsumptionTableRow>
                                <ConsumptionTableRow
                                    label={t("app.profile.homeEnergyLabel")}
                                >
                                    {userData.homeEnergyLabel == "unsure"
                                        ? t("common.unsure")
                                        : userData.homeEnergyLabel ?? ""}
                                </ConsumptionTableRow>
                                <ConsumptionTableRow
                                    label={t("app.profile.householdProfile")}
                                >
                                    {userData.householdProfile
                                        ? t(
                                              `app.user.householdProfile.${userData.householdProfile}`,
                                          )
                                        : ""}
                                </ConsumptionTableRow>
                                <ConsumptionTableRow
                                    label={t("app.profile.country")}
                                >
                                    {t(
                                        countriesMapping.find(
                                            (e) => e.ID === userData.country,
                                        )?.name,
                                    ) ?? ""}
                                </ConsumptionTableRow>
                                <ConsumptionTableRow
                                    label={t("app.profile.city")}
                                >
                                    {t(
                                        citiesMappings.find(
                                            (e) => e.ID === userData.city,
                                        )?.name,
                                    ) ?? ""}
                                </ConsumptionTableRow>
                                <ConsumptionTableRow
                                    label={t("app.profile.unitSystem")}
                                >
                                    {t(
                                        unitSystems.find(
                                            (e) =>
                                                e.key ===
                                                userData.settings?.unitSystem,
                                        )?.label,
                                    ) ??
                                        t(
                                            "app.user.settings.unitSystem.metric",
                                        )}
                                </ConsumptionTableRow>
                                <ConsumptionTableRow
                                    label={t("app.profile.userID")}
                                >
                                    {user?.uid}
                                </ConsumptionTableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                        <EditUserDataModal>
                            <Button variant={"outline"} className="w-full">
                                {t("app.form.profile.editProfile")}
                            </Button>
                        </EditUserDataModal>
                    </CardFooter>
                </Card>
            </Flex>
            <Flex direction={"column"} className="gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("app.account.account")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Flex direction={"column"} className="gap-2">
                            {authProvider == "password" && (
                                <>
                                    <ChangeEmailModal>
                                        <Button variant={"outline"}>
                                            {t("app.account.changeEmail")}
                                        </Button>
                                    </ChangeEmailModal>
                                    <ChangePasswordModal>
                                        <Button variant={"outline"}>
                                            {t("app.account.changePassword")}
                                        </Button>
                                    </ChangePasswordModal>
                                </>
                            )}
                            <Button
                                variant={"outline"}
                                onClick={downloadUserDataWrapper}
                                disabled={downloading}
                            >
                                {downloading
                                    ? t("button.downloadPending")
                                    : t("app.account.downloadMyData")}
                            </Button>
                            <DeleteAccountModal>
                                <Button variant="destructive">
                                    {t("app.account.deleteMyAccount")}
                                </Button>
                            </DeleteAccountModal>
                        </Flex>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t("app.support.support")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Flex direction={"column"} className="gap-2">
                            <Button variant={"outline"} asChild>
                                <Link href={externalLinks.appDownload}>
                                    {t("app.support.getTheApp")}
                                </Link>
                            </Button>

                            <Button variant={"outline"} asChild>
                                <Link href={supportLink.href}>
                                    {t("app.support.contactSupport")}
                                </Link>
                            </Button>
                        </Flex>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t("app.legal.legalInformation")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Flex direction={"column"} className="gap-2">
                            <Button variant={"outline"} asChild>
                                <Link href={externalLinks.imprint}>
                                    {t("app.legal.imprint")}
                                </Link>
                            </Button>

                            <Button variant={"outline"} asChild>
                                <Link href={externalLinks.privacyPolicy}>
                                    {t("app.legal.privacyPolicy")}
                                </Link>
                            </Button>

                            <Button variant={"outline"} asChild>
                                <Link href={externalLinks.termsOfService}>
                                    {t("app.legal.termsOfService")}
                                </Link>
                            </Button>
                        </Flex>
                    </CardContent>
                </Card>
            </Flex>
        </Grid>
    );
};

export default UserSettingsPage;
