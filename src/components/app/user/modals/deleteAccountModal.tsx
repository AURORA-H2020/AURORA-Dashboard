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
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import BorderBox from "../../common/borderBox";

const DeleteAccountModal = ({
    children,
    title,
    description,
}: {
    children: React.ReactNode;
    title?: string;
    description?: string;
}) => {
    const t = useTranslations();
    const { user } = useAuthContext();

    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);

    const [isDeleteConfirm, setDeleteConfirm] = useState(false);

    const handleUserDelete = async (user: User) => {
        const { success, requiresReauth } = await deleteAccount(user);

        if (success) {
            toast.success(t("toast.deleteAccount.success"));
            setDeleteAlertOpen(false);
        } else {
            if (requiresReauth) {
                toast.error(t("toast.deleteAccount.reAuthErrorTitle"), {
                    duration: 10000,
                    description: t(
                        "toast.deleteAccount.reAuthErrorDescription",
                    ),
                });
            } else toast.error(t("toast.deleteAccount.generalError"));
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
                    <AlertDialogTitle>
                        {title ?? t("app.account.deletePopup.title")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {description ??
                            t("app.account.deletePopup.description")}
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
                            {t(
                                "app.account.deletePopup.confirmationDisclaimer",
                            )}
                        </Label>
                    </Flex>
                </BorderBox>
                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel
                        onClick={() => setDeleteAlertOpen(false)}
                    >
                        {t("common.cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={!isDeleteConfirm}
                        onClick={() => handleUserDelete(user)}
                    >
                        {t("app.account.deleteMyAccount")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteAccountModal;
