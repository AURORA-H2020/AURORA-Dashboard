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
import { useState } from "react";

const ResetPasswordModal = ({ children }: { children: React.ReactNode }) => {
    const t = useTranslations();
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t("ui.auth.resetPassword.resetPassword")}
                    </DialogTitle>
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
