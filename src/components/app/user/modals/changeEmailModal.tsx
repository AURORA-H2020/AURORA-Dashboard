"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ChangeEmailForm from "../forms/changeEmailForm";

const ChangeEmailModal = ({ children }: { children: React.ReactNode }) => {
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

export default ChangeEmailModal;
