"use client";

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
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loading";
import { useAuthContext } from "@/context/AuthContext";
import { deleteAccount } from "@/firebase/firestore/deleteAccount";
import { downloadUserData } from "@/firebase/firestore/downloadUserData";
import { useRouter } from "@/navigation";
import { Flex, Grid } from "@radix-ui/themes";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Renders the user settings page with profile and account information.
 *
 * @return {JSX.Element} The user settings page component
 */
function UserSettings(): JSX.Element {
    const { user, loading } = useAuthContext() as {
        user: User;
        loading: boolean;
    };
    const router = useRouter();

    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);

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
                <Card>
                    <CardContent className="p-6">
                        <Flex direction={"column"} className="gap-2">
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
            </Grid>

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
