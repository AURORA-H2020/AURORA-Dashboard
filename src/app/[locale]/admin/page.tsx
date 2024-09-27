"use client";

import { UsersTable } from "@/components/admin/usersTable";
import { LoadingSpinner } from "@/components/ui/loading";
import { getLatestUserData } from "@/firebase/firebase-utils";
import { useFetchBlacklistedUsers } from "@/firebase/hooks/user-hooks";
import { BackupUserData } from "@/models/extensions";
import { BlacklistedUser } from "@/models/firestore/_export-user-data-blacklisted-users/blacklisted-user";
import { useAuthContext } from "@/providers/context/authContext";
import { ReactNode, useEffect, useState } from "react";

/**
 * The AdminPage component.
 *
 * This component is responsible for rendering the admin page. It fetches the latest
 * user data from Firestore and also fetches the list of blacklisted users from the
 * BlacklistedUsers collection in Firestore.
 *
 * The component renders a loading spinner while the data is being fetched, and renders
 * a table of users if the data is available.
 *
 * @return {ReactNode} The rendered AdminPage component.
 */
const AdminPage = (): ReactNode => {
  // Fetch the currently logged in user
  const { user, loading } = useAuthContext();

  // Hook to fetch the latest user data from Firestore
  const [userData, setUserData] = useState<BackupUserData | null>(null);

  // Hook to fetch the list of blacklisted users from Firestore
  const blacklistedUsers =
    useFetchBlacklistedUsers(user).blacklistedUsers?.docs;

  // Map the list of blacklisted users to an array of objects with the uid and data
  const blacklistData = blacklistedUsers?.map((user) => ({
    uid: user.id,
    data: user.data() as BlacklistedUser,
  }));

  // When the user changes, fetch the latest user data
  useEffect(() => {
    if (!user) {
      return;
    }
    getLatestUserData().then((data) => {
      setUserData(data as BackupUserData);
    });
  }, [user]);

  // If the data is still being fetched or if the user data is not available, show a loading spinner
  if (loading || !userData) {
    return <LoadingSpinner />;
  }

  // If the data is available, render the UsersTable component with the user data and blacklist data
  return <UsersTable userData={userData} blacklistData={blacklistData} />;
};

export default AdminPage;
