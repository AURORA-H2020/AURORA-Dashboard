import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFirebaseData } from "@/context/FirebaseContext";
import { useState } from "react";
import UserDataForm from "./userDataForm";

export default function EditUserDataModal({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { userData } = useFirebaseData();

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
                            className="p-2"
                        />
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
}
