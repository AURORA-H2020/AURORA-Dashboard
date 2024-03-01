import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFirebaseData } from "@/context/FirebaseContext";
import { useState } from "react";
import UserDataForm from "../forms/userDataForm";

export default function EditUserDataModal({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);

    const { userData } = useFirebaseData();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-lg p-0">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[80vh] p-6">
                    <UserDataForm
                        userData={userData}
                        onFormSubmit={() => setOpen(false)}
                        className="p-2"
                    />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
