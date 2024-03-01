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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/context/AuthContext";
import { deleteAccount } from "@/firebase/firestore/deleteAccount";
import { Flex } from "@radix-ui/themes";
import { User } from "firebase/auth";
import { useState } from "react";
import { toast } from "sonner";
import BorderBox from "../../common/borderBox";

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

    const [isDeleteConfirm, setDeleteConfirm] = useState(false);

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
                <BorderBox className="mt-2">
                    <Flex direction="row" align="center" className="space-x-4">
                        <Checkbox
                            onCheckedChange={(value) =>
                                value === true
                                    ? setDeleteConfirm(true)
                                    : setDeleteConfirm(false)
                            }
                            id="confirm-delete"
                        />
                        <Label
                            htmlFor="confirm-delete"
                            className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Yes, I want to delete my account and understand that
                            it is lost forever.
                        </Label>
                    </Flex>
                </BorderBox>
                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel
                        onClick={() => setDeleteAlertOpen(false)}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={!isDeleteConfirm}
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
