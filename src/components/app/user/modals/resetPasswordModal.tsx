"use client";

import { ResetPasswordForm } from "@/components/app/user/forms/resetPasswordForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";

/**
 * Renders a modal component for resetting the user's password.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content to be displayed as the trigger for the modal.
 * @return {ReactNode} The rendered modal component.
 */
const ResetPasswordModal = ({ children }: { children: ReactNode }) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("ui.auth.resetPassword.resetPassword")}</DialogTitle>
          <DialogDescription>
            {t("ui.auth.resetPassword.description")}
          </DialogDescription>
        </DialogHeader>
        <ResetPasswordForm onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export { ResetPasswordModal };
