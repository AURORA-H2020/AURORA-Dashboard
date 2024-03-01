import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import ResetPasswordForm from "../forms/resetPasswordForm";

const ResetPasswordModal = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Forgot Password</DialogTitle>
                    <DialogDescription>
                        Provide the email address you used to register your
                        account below. We will send you a password reset link.
                    </DialogDescription>
                </DialogHeader>
                <ResetPasswordForm onFormSubmit={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
};

export default ResetPasswordModal;
