"use client";

import { UserDataForm } from "@/components/app/user/forms/userDataForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFirebaseData } from "@/context/FirebaseContext";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";

/**
 * Renders the Edit User Data Modal component.
 *
 * @param {ReactNode} children - The content to be displayed as the trigger for the modal.
 * @return {ReactNode} The rendered Edit User Data Modal component.
 */
const EditUserDataModal = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const { userData } = useFirebaseData();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="">
          <DialogTitle>{t("app.form.profile.editProfile")}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <UserDataForm
            userData={userData}
            onFormSubmit={() => setOpen(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export { EditUserDataModal };
