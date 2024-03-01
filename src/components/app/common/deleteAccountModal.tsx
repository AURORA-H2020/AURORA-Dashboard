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
import { useAuthContext } from "@/context/AuthContext";
import { deleteAccount } from "@/firebase/firestore/deleteAccount";
import { User } from "firebase/auth";
import { useState } from "react";
import { toast } from "sonner";

const DeleteAccountModal = ({
    children,
    title = "Are you sure you want to delete your account?",
    description = "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
}: {
    children: React.ReactNode;
    title?: string;
    description?: string;
}) => {
    const { user } = useAuthContext();

    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);

    const handleUserDelete = async (user: User) => {
        const { success, requiresReauth } = await deleteAccount(user);

        if (success) {
            toast.success("Your account has been deleted");
            setDeleteAlertOpen(false);
        } else {
            if (requiresReauth) {
                toast.error("Please reauthenticate to update your password", {
                    duration: 10000,
                    description: "You can do this by logging out and back in.",
                });
            } else toast.error("An error occurred updating your password");
        }
    };

    if (!user) return;

    return (
        <AlertDialog open={isDeleteAlertOpen}>
            <AlertDialogTrigger
                asChild
                onClick={() => setDeleteAlertOpen(true)}
            >
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
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
                        onClick={() => handleUserDelete(user)}
                    >
                        Delete Account
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteAccountModal;
