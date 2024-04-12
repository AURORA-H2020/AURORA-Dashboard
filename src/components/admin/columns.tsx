"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { DataTableColumnHeader } from "../ui/data-table-column-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { UserRow } from "./usersTable";
import { Checkbox } from "../ui/checkbox";

export const columns: ColumnDef<UserRow>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
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
            <DataTableColumnHeader
                column={column}
                title="Recurring Consumptions"
            />
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
        accessorKey: "blacklisted",
        header: "Blacklisted",
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
                            onClick={() =>
                                navigator.clipboard.writeText(user.uid)
                            }
                        >
                            Copy user ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View user</DropdownMenuItem>
                        <DropdownMenuItem>Blacklist</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
