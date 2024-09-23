"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ViewUserModal } from "./modals/viewUser";
import { UserRow } from "./usersTable";

/**
 * Generates an array of column definitions for a table.
 *
 * @param {Object} userData - An object containing user data.
 * @return {Array<ColumnDef<UserRow>>} An array of column definitions.
 */
export const columns = (userData): ColumnDef<UserRow>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "uid",
      header: "UID",
    },
    {
      accessorKey: "consumptions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Consumptions" />
      ),
    },
    {
      accessorKey: "recurringConsumptions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Recurring Consumptions" />
      ),
    },
    {
      accessorKey: "carbonEmissions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Carbon Emissions" />
      ),
      cell: ({ row }) => {
        const value = Math.floor(row.getValue("carbonEmissions"));
        const formatted = new Intl.NumberFormat("en-US").format(value);

        return <div className="text-left">{formatted}</div>;
      },
    },
    {
      accessorKey: "energyExpended",
      size: 20,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Energy Expended" />
      ),
      cell: ({ row }) => {
        const value = Math.floor(row.getValue("energyExpended"));
        const formatted = new Intl.NumberFormat("en-US").format(value);

        return <div className="text-left">{formatted}</div>;
      },
    },
    {
      accessorKey: "blacklistData",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Blacklisted" />
      ),
      cell: ({ row }) => {
        return row.original.blacklistData !== null ? "Yes" : "No";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.uid)}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ViewUserModal
                user={userData[user.uid]}
                uid={user.uid}
                blacklistData={user.blacklistData}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  View user
                </DropdownMenuItem>
              </ViewUserModal>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
