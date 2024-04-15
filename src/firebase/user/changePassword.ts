import { reauthenticateUser } from "@/firebase/auth/reauthenticate";
import { User, updatePassword } from "firebase/auth";

export const changePassword = async (
    user: User | null,
    currentPassword: string,
    newPassword: string,
) => {
    let success = false;

    if (user) {
        await reauthenticateUser(user, currentPassword).then(async (reauth) => {
            if (reauth.success && reauth.reauthUser) {
                await updatePassword(reauth.reauthUser, newPassword)
                    .then(() => {
                        console.log("Password updated successfully");
                        success = true;
                    })
                    .catch((error) => {
                        console.error("Error updating password: ", error);
                    });
            } else {
                console.error("An error occurred updating the password.");
            }
        });
    } else {
        throw new Error("User is not logged in.");
    }

    return { success };
};
