import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { logout } from "@/firebase/auth/logout";
import { User as FirebaseUser } from "@/models/firestore/user/user";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import UserDataForm from "./userDataForm";

export default function InitialRegistrationModal({
    userData,
}: {
    userData?: FirebaseUser | null;
}) {
    const t = useTranslations();
    const router = useRouter();

    const handleCloseModal = () => {
        router.refresh();
    };

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <AlertDialog open={true}>
            <AlertDialogContent className="sm:max-w-lg p-0">
                <ScrollArea className="max-h-[80vh] p-6">
                    <UserDataForm
                        userData={userData}
                        isNewUser={true}
                        onFormSubmit={handleCloseModal}
                    />
                </ScrollArea>
                <AlertDialogCancel onClick={handleLogout}>
                    {t("navigation.menu.logout")}
                </AlertDialogCancel>
            </AlertDialogContent>
        </AlertDialog>
    );
}
