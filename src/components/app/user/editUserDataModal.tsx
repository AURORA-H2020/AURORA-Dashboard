import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User as FirebaseUser } from "@/models/firestore/user/user";
import { useState } from "react";
import UserDataForm from "./userDataForm";

export default function EditUserDataModal({
    userData,
    children,
}: {
    userData?: FirebaseUser | null;
    children: React.ReactNode;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div onClick={() => setIsModalOpen(true)}>{children}</div>
            <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
                <DialogContent className="sm:max-w-lg p-0">
                    <ScrollArea className="max-h-[80vh] p-6">
                        <UserDataForm
                            userData={userData}
                            onFormSubmit={handleCloseModal}
                        />
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}
