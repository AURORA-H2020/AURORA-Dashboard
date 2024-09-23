"use client";

import { DataTable } from "@/components/ui/data-table";
import { BackupUserData } from "@/models/extensions";
import { BlacklistedUser } from "@/models/firestore/_export-user-data-blacklisted-users/blacklisted-user";
import { ReactNode } from "react";
import { columns } from "./columns";

export type UserRow = {
  uid: string;
  consumptions: number;
  recurringConsumptions: number;
  carbonEmissions: number;
  energyExpended: number;
  blacklistData: BlacklistedUser | null;
};

/**
 * Renders a table of user data, including user ID, number of consumptions, number of recurring consumptions,
 * total carbon emissions, and total energy expended. Also includes blacklist data for each user, if available.
 *
 * @param {Object} props - The component props.
 * @param {BackupUserData} props.userData - The user data to be displayed in the table.
 * @param {Array<Object>} [props.blacklistData] - Optional array of blacklisted user data, where each object contains
 * a user ID and the corresponding blacklisted user data.
 * @return {ReactNode} The rendered table of user data.
 */
export const UsersTable = ({
  userData,
  blacklistData,
}: {
  userData: BackupUserData;
  blacklistData: { uid: string; data: BlacklistedUser }[] | undefined;
}): ReactNode => {
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
      blacklistData:
        blacklistData?.find((user) => user.uid === uid)?.data || null,
    };
  });

  return (
    <DataTable
      columns={columns(userData)}
      data={userTableData}
      initialState={{
        columnVisibility: { recurringConsumptions: false },
      }}
    />
  );
};
