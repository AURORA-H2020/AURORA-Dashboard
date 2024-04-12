"use client";

import { UsersTable } from "@/components/admin/usersTable";
import LoadingSpinner from "@/components/ui/loading";
import { useAuthContext } from "@/context/AuthContext";
import { getLatestUserData } from "@/lib/firebaseUtils";
import { BackupUserData } from "@/models/extensions";
import { useEffect, useState } from "react";

const AdminPage = (): JSX.Element => {
    const { user, loading } = useAuthContext();

    const [userData, setUserData] = useState<BackupUserData | null>(null);

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

    return <UsersTable userData={userData} />;
};

export default AdminPage;
