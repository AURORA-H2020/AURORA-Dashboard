import {
  EmailAuthProvider,
  User,
  reauthenticateWithCredential,
} from "firebase/auth";

/**
 * Reauthenticates a user with their email and password.
 *
 * @param {User} user - The user object representing the authenticated user.
 * @param {string} [password] - The password of the user.
 * @return {Promise<{ success: boolean, reauthUser
 */
export async function reauthenticateUser(
  user: User,
  password?: string,
): Promise<{ success: boolean; reauthUser: User | null }> {
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
