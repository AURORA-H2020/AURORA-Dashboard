"use client";

import { useFetchBlacklistedUsers } from "@/firebase/firebaseHooks";
import { BackupUserData } from "@/models/extensions";
import { DataTable } from "../ui/data-table";
import { columns } from "./columns";

export type UserRow = {
    uid: string;
    consumptions: number;
    recurringConsumptions: number;
    carbonEmissions: number;
    energyExpended: number;
    blacklisted: boolean;
};

export const UsersTable = ({ userData }: { userData: BackupUserData }) => {
    const blacklistedUsers = useFetchBlacklistedUsers().blacklistedUsers?.docs;
    const blacklistedUserIds = blacklistedUsers?.map((user) => user.id);

    const userTableData: UserRow[] = Object.keys(userData).map((uid) => {
        return {
            uid: uid,
            consumptions: userData[uid].consumptions.length,
            recurringConsumptions: userData[uid].recurringConsumptions.length,
            carbonEmissions: userData[uid].consumptionSummaries.reduce(
                (acc, summary) => {
                    return acc + summary.carbonEmission.total;
                },
                0,
            ),
            energyExpended: userData[uid].consumptionSummaries.reduce(
                (acc, summary) => {
                    return acc + summary.energyExpended.total;
                },
                0,
            ),
            blacklisted: blacklistedUserIds?.includes(uid) ? true : false,
        };
    });

    return <DataTable columns={columns} data={userTableData} />;
};
