import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import ChangeEmailForm from "../forms/changeEmailForm";

const ChangeEmailModal = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Email</DialogTitle>
                </DialogHeader>
                <ChangeEmailForm onFormSubmit={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
};

export default ChangeEmailModal;
