"use client";

import { ChangeEmailForm } from "@/components/app/user/forms/changeEmailForm";
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
 * Renders a modal component for changing the user's email.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content to be displayed as the trigger for the modal.
 * @return {ReactNode} The rendered modal component.
 */
const ChangeEmailModal = ({ children }: { children: ReactNode }): ReactNode => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("app.account.changeEmail")}</DialogTitle>
        </DialogHeader>
        <ChangeEmailForm onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export { ChangeEmailModal };
