"use client";

import ConsumptionTableRow from "@/components/app/common/consumptionTableRow";
import DeleteAccountModal from "@/components/app/common/deleteAccountModal";
import { ChangeEmailForm } from "@/components/app/user/changeEmailForm";
import { ChangePasswordForm } from "@/components/app/user/changePasswordForm";
import EditUserDataModal from "@/components/app/user/editUserDataModal";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loading";
import { Table, TableBody } from "@/components/ui/table";
import { useAuthContext } from "@/context/AuthContext";
import { useFirebaseData } from "@/context/FirebaseContext";
import { downloadUserData } from "@/firebase/firestore/downloadUserData";
import { Flex, Grid } from "@radix-ui/themes";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Renders the user settings page with profile and account information.
 *
 * @return {JSX.Element} The user settings page component
 */
const UserSettings = (): JSX.Element => {
    const { user, loading } = useAuthContext();

    const { userData } = useFirebaseData();

    // State to manage the visibility of the modal
    const [isModalChangeEmailOpen, setModalChangeEmailOpen] = useState(false);
    const [isModalChangePasswordOpen, setModalChangePasswordOpen] =
        useState(false);

    /**
     * Closes the modal for changing email and password.
     */
    const closeModal = () => {
        setModalChangeEmailOpen(false);
        setModalChangePasswordOpen(false);
    };

    const [downloading, setDownloading] = useState(false);
    /**
     * Wrapper function to handle downloading user data.
     *
     * @return {Promise<void>} Resolves when user data is downloaded successfully
     */
    const downloadUserDataWrapper = async () => {
        setDownloading(true);
        try {
            await downloadUserData();
            toast.success("Your data was successfully downloaded");
        } catch (error) {
            // Handle the error
            console.error("Error downloading user data:", error);
            toast.error("Your data could not be downloaded");
        } finally {
            setDownloading(false);
        }
    };

    if (loading || !user || !userData) return <LoadingSpinner />;

    const supportLink = new URL("https://www.aurora-h2020.eu/app-support/");
    supportLink.search = new URLSearchParams({
        user_id: user.uid,
        country_id: userData.country,
    }).toString();

    // Authenticated user content
    return (
        <>
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
                            <CardTitle>Your Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableBody>
                                    <ConsumptionTableRow label="First name">
                                        {userData?.firstName}
                                    </ConsumptionTableRow>
                                    <ConsumptionTableRow label="Last name">
                                        {userData?.lastName}
                                    </ConsumptionTableRow>
                                    <ConsumptionTableRow label="Year of birth">
                                        {userData?.yearOfBirth}
                                    </ConsumptionTableRow>
                                    <ConsumptionTableRow label="Gender">
                                        {userData?.gender || ""}
                                    </ConsumptionTableRow>
                                    <ConsumptionTableRow label="Home energy label">
                                        {userData?.homeEnergyLabel || ""}
                                    </ConsumptionTableRow>
                                    <ConsumptionTableRow label="Household profile">
                                        {userData?.householdProfile || ""}
                                    </ConsumptionTableRow>
                                    <ConsumptionTableRow label="Country">
                                        {userData?.country || ""}
                                    </ConsumptionTableRow>
                                    <ConsumptionTableRow label="City">
                                        {userData?.city || ""}
                                    </ConsumptionTableRow>
                                    <ConsumptionTableRow label="User ID">
                                        {user?.uid}
                                    </ConsumptionTableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter>
                            <EditUserDataModal>
                                <Button variant={"outline"}>
                                    Edit profile
                                </Button>
                            </EditUserDataModal>
                        </CardFooter>
                    </Card>
                </Flex>
                <Flex direction={"column"} className="gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Flex direction={"column"} className="gap-2">
                                <Button
                                    variant={"outline"}
                                    onClick={() =>
                                        setModalChangeEmailOpen(true)
                                    }
                                >
                                    Change email
                                </Button>
                                <Button
                                    variant={"outline"}
                                    onClick={() =>
                                        setModalChangePasswordOpen(true)
                                    }
                                >
                                    Change password
                                </Button>
                                <Button
                                    variant={"outline"}
                                    onClick={downloadUserDataWrapper}
                                    disabled={downloading}
                                >
                                    {downloading
                                        ? "Downloading..."
                                        : "Download my data"}
                                </Button>
                                <DeleteAccountModal>
                                    <Button variant="destructive">
                                        Delete my account
                                    </Button>
                                </DeleteAccountModal>
                            </Flex>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Support</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Flex direction={"column"} className="gap-2">
                                <Button variant={"outline"} asChild>
                                    <Link href="https://www.aurora-h2020.eu/aurora/ourapp/">
                                        Get the app
                                    </Link>
                                </Button>

                                <Button variant={"outline"} asChild>
                                    <Link href={supportLink.href}>
                                        Contact support
                                    </Link>
                                </Button>
                            </Flex>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Legal Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Flex direction={"column"} className="gap-2">
                                <Button variant={"outline"} asChild>
                                    <Link href="https://www.aurora-h2020.eu/aurora/app-imprint/">
                                        Imprint
                                    </Link>
                                </Button>

                                <Button variant={"outline"} asChild>
                                    <Link href="https://www.aurora-h2020.eu/aurora/app-privacy-policy/">
                                        Privacy Policy
                                    </Link>
                                </Button>

                                <Button variant={"outline"} asChild>
                                    <Link href="https://www.aurora-h2020.eu/aurora/app-tos/">
                                        Terms of Service
                                    </Link>
                                </Button>
                            </Flex>
                        </CardContent>
                    </Card>
                </Flex>
            </Grid>

            <Dialog open={isModalChangeEmailOpen} onOpenChange={closeModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Email</DialogTitle>
                    </DialogHeader>
                    <ChangeEmailForm onFormSubmit={closeModal} />
                </DialogContent>
            </Dialog>

            <Dialog open={isModalChangePasswordOpen} onOpenChange={closeModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <ChangePasswordForm onFormSubmit={closeModal} />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UserSettings;
