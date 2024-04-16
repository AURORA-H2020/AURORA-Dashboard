"use client";

import { UsersTable } from "@/components/admin/usersTable";
import LoadingSpinner from "@/components/ui/loading";
import { useAuthContext } from "@/context/AuthContext";
import { useFetchBlacklistedUsers } from "@/firebase/firebaseHooks";
import { getLatestUserData } from "@/lib/firebaseUtils";
import { BackupUserData } from "@/models/extensions";
import { BlacklistedUser } from "@/models/firestore/_export-user-data-blacklisted-users/blacklisted-user";
import { useEffect, useState } from "react";

const AdminPage = (): JSX.Element => {
    const { user, loading } = useAuthContext();

    const [userData, setUserData] = useState<BackupUserData | null>(null);

    const blacklistedUsers =
        useFetchBlacklistedUsers(user).blacklistedUsers?.docs;
    const blacklistData = blacklistedUsers?.map((user) => ({
        uid: user.id,
        data: user.data() as BlacklistedUser,
    }));

    useEffect(() => {
        if (!user) {
            return;
        }

        getLatestUserData().then((data) => {
            setUserData(data as BackupUserData);
        });
    }, [user]);

    if (loading || !userData) {
        return <LoadingSpinner />;
    }

    return <UsersTable userData={userData} blacklistData={blacklistData} />;
};

export default AdminPage;
