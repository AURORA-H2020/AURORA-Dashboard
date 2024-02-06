"use client";

import ConsumptionTableRow from "@/components/app/consumptions/consumptionTableRow";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loading";
import { Table, TableBody } from "@/components/ui/table";
import { useAuthContext } from "@/context/AuthContext";
import firebase_app from "@/firebase/config";
import { deleteAccount } from "@/firebase/firestore/deleteAccount";
import { downloadUserData } from "@/firebase/firestore/downloadUserData";
import { city2Name, country2Name, titleCase } from "@/lib/utilities";
import { User as FirebaseUser } from "@/models/firestore/user/user";
import { Flex, Grid } from "@radix-ui/themes";
import { User } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FirebaseConstants } from "@/firebase/firebase-constants";

const firestore = getFirestore(firebase_app);

/**
 * Renders the user settings page with profile and account information.
 *
 * @return {JSX.Element} The user settings page component
 */
function UserSettings(): JSX.Element {
    const t = useTranslations();

    const { user, loading } = useAuthContext() as {
        user: User;
        loading: boolean;
    };
    const router = useRouter();

    const [userData, setUserData] = useState<FirebaseUser | null>(null);

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

    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);

    // Fetch the user document from Firestore
    const fetchDocumentById = async (documentId: string) => {
        const docRef = doc(
            firestore,
            FirebaseConstants.collections.users.name,
            documentId,
        );
        try {
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                console.log("Document data:", docSnapshot.data());
                setUserData(docSnapshot.data() as FirebaseUser);
            } else {
                console.log("No such document!");
                setUserData(null);
            }
        } catch (error) {
            console.error("Error getting document:", error);
        }
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

    useEffect(() => {
        if (loading) return;

        // Redirect to the home page if no user is authenticated
        if (!user) {
            router.replace("/");
            return;
        }

        // If there's a user, fetch the document by user ID
        fetchDocumentById(user.uid);
    }, [user, router, loading]);

    if (!user && loading) {
        // Render loading indicator until the auth check is complete
        return <LoadingSpinner />;
    }

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
                                        {titleCase(userData?.gender || "")}
                                    </ConsumptionTableRow>
                                    <ConsumptionTableRow label="Home energy label">
                                        {titleCase(
                                            userData?.homeEnergyLabel || "",
                                        )}
                                    </ConsumptionTableRow>
                                    <ConsumptionTableRow label="Household profile">
                                        {titleCase(
                                            userData?.householdProfile || "",
                                        )}
                                    </ConsumptionTableRow>
                                    <ConsumptionTableRow label="Country">
                                        {t(
                                            country2Name(
                                                userData?.country || "",
                                            ).name,
                                        )}
                                    </ConsumptionTableRow>
                                    <ConsumptionTableRow label="City">
                                        {city2Name(userData?.city || "")}
                                    </ConsumptionTableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
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
                                <Button
                                    variant="destructive"
                                    onClick={() => setDeleteAlertOpen(true)}
                                >
                                    Delete my account
                                </Button>
                            </Flex>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Support</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Flex direction={"column"} className="gap-2">
                                <Button variant={"outline"}>Get the app</Button>
                                <Button variant={"outline"}>
                                    Contact support
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
                                <Button variant={"outline"}>Imprint</Button>
                                <Button variant={"outline"}>
                                    Privacy Policy
                                </Button>
                                <Button variant={"outline"}>
                                    Terms of Service
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
                    <Flex direction={"column"} className={"gap-4"}>
                        <Input></Input>
                    </Flex>
                    <DialogFooter className="flex sm:justify-between">
                        {/* TODO: Add button functionality */}
                        <Flex className="space-x-2">
                            <Button type="submit">Cancel</Button>
                            <Button type="submit">Save</Button>
                        </Flex>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isModalChangePasswordOpen} onOpenChange={closeModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <Flex direction={"column"} className={"gap-4"}>
                        <Input></Input>
                    </Flex>
                    <DialogFooter className="flex sm:justify-between">
                        {/* TODO: Add button functionality */}
                        <Flex className="space-x-2">
                            <Button type="submit">Cancel</Button>
                            <Button type="submit">Save</Button>
                        </Flex>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete your account?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setDeleteAlertOpen(false)}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={deleteAccount}
                        >
                            Delete Account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default UserSettings;
