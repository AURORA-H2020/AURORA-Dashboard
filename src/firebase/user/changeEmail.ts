import { User, updateEmail } from "firebase/auth";
import { reauthenticateUser } from "../auth/reauthenticate";

export const changeEmail = async (
    user: User | null,
    currentPassword: string,
    newEmail: string,
) => {
    let success = false;

    if (user) {
        await reauthenticateUser(user, currentPassword).then(async (reauth) => {
            if (reauth.success && reauth.reauthUser) {
                await updateEmail(reauth.reauthUser, newEmail)
                    .then(() => {
                        console.log("Email updated successfully");
                        success = true;
                    })
                    .catch((error) => {
                        console.error("Error updating email: ", error);
                    });
            } else {
                console.error("An error occurred updating the email.");
            }
        });
    } else {
        throw new Error("User is not logged in.");
    }

    return { success };
};
