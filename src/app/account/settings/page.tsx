"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import { User as FirebaseUser } from "@/models/firestore/user/user";
import firebase_app from "@/firebase/config";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import LoadingSpinner from "@/components/ui/loading";
import { Flex, Grid, Strong } from "@radix-ui/themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import ConsumptionTableRow from "@/components/app/consumptions/consumptionTableRow";
import { city2Name, country2Name, titleCase } from "@/lib/utilities";
import { Button } from "@/components/ui/button";
import { downloadUserData } from "@/firebase/firestore/downloadUserData";
import { deleteAccount } from "@/firebase/firestore/deleteAccount";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const firestore = getFirestore(firebase_app);

function UserSettings(): JSX.Element {
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

    const closeModal = () => {
        setModalChangeEmailOpen(false);
        setModalChangePasswordOpen(false);
    };

    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);

    // Fetch the user document from Firestore
    const fetchDocumentById = async (documentId: string) => {
        const docRef = doc(firestore, "users", documentId);
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
                                        {
                                            country2Name(
                                                userData?.country || "",
                                            ).name
                                        }
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
                                    onClick={() =>
                                        setModalChangeEmailOpen(true)
                                    }
                                >
                                    Change email
                                </Button>
                                <Button
                                    onClick={() =>
                                        setModalChangePasswordOpen(true)
                                    }
                                >
                                    Change password
                                </Button>
                                <Button
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
                                <Button>Get the app</Button>
                                <Button>Contact support</Button>
                            </Flex>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Legal Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Flex direction={"column"} className="gap-2">
                                <Button>Imprint</Button>
                                <Button>Privacy Policy</Button>
                                <Button>Terms of Service</Button>
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
