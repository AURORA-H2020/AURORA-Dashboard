import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFirebaseData } from "@/context/FirebaseContext";
import { logout } from "@/firebase/auth/logout";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import UserDataForm from "./userDataForm";

export default function InitialRegistrationModal() {
    const t = useTranslations();
    const router = useRouter();

    const { userData } = useFirebaseData();

    const handleLogout = async () => {
        await logout();
        router.replace("/");
    };

    return (
        <AlertDialog open={true}>
            <AlertDialogContent className="sm:max-w-lg p-0">
                <ScrollArea className="max-h-[80vh] p-6">
                    <UserDataForm userData={userData} isNewUser={true} />
                </ScrollArea>
                <AlertDialogCancel onClick={handleLogout}>
                    {t("navigation.menu.logout")}
                </AlertDialogCancel>
            </AlertDialogContent>
        </AlertDialog>
    );
}
