import { ChangePasswordForm } from "@/components/app/user/forms/changePasswordForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";

/**
 * Renders a modal component for changing the user's password.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content to be displayed as the trigger for the modal.
 * @return {ReactNode} The rendered modal component.
 */
const ChangePasswordModal = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("app.account.changePassword")}</DialogTitle>
        </DialogHeader>
        <ChangePasswordForm onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export { ChangePasswordModal };
