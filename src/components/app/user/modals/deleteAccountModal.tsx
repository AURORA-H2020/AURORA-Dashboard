import { BorderBox } from "@/components/app/common/borderBox";
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
import { deleteAccount } from "@/firebase/firestore/delete-account";
import { useAuthContext } from "@/providers/context/authContext";
import { Flex } from "@radix-ui/themes";
import { User } from "firebase/auth";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { toast } from "sonner";

/**
 * Renders the DeleteAccountModal component.
 *
 * @param {ReactNode} children - The content to be displayed inside the modal.
 * @param {string} [title] - The title of the modal.
 * @param {string} [description] - The description of the modal.
 * @return {ReactNode} The rendered DeleteAccountModal component.
 */
const DeleteAccountModal = ({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
}): ReactNode => {
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
          description: t("toast.deleteAccount.reAuthErrorDescription"),
        });
      } else toast.error(t("toast.deleteAccount.generalError"));
    }
  };

  if (!user) return;

  return (
    <AlertDialog open={isDeleteAlertOpen}>
      <AlertDialogTrigger asChild onClick={() => setDeleteAlertOpen(true)}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title ?? t("app.account.deletePopup.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ?? t("app.account.deletePopup.description")}
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
              {t("app.account.deletePopup.confirmationDisclaimer")}
            </Label>
          </Flex>
        </BorderBox>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel onClick={() => setDeleteAlertOpen(false)}>
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

export { DeleteAccountModal };
