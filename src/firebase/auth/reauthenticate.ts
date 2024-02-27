import {
    EmailAuthProvider,
    User,
    reauthenticateWithCredential,
} from "firebase/auth";

export async function reauthenticateUser(user: User, password?: string) {
    let success = false;
    let reauthUser: User | null = null;

    if (user.email && password) {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential)
            .then((reauth) => {
                success = true;
                reauthUser = reauth.user;
            })
            .catch((error) => {
                console.error("Error reauthenticating user: ", error);
            });
    } else {
        throw new Error("User is not logged in.");
    }

    return { success, reauthUser };
}
