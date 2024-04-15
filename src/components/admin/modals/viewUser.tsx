"use client";

import BorderBox from "@/components/app/common/borderBox";
import ConsumptionSummaryChart from "@/components/app/summary/consumptionSummaryChart";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/context/AuthContext";
import { unBlacklistUser } from "@/firebase/admin/handleBlacklist";
import { blacklistedReasonsList } from "@/lib/constants/admin";
import { cn } from "@/lib/utilities";
import { ExtendedUser } from "@/models/extensions";
import { BlacklistedUser } from "@/models/firestore/_export-user-data-blacklisted-users/blacklisted-user";
import { ConsumptionSummary } from "@/models/firestore/consumption-summary/consumption-summary";
import React, { useEffect, useMemo, useState } from "react";
import BlacklistUserModal from "./blacklistUser";

const ViewUserModal = React.forwardRef(
    (
        props: {
            children: React.ReactNode;
            user: ExtendedUser;
            uid: string;
            blacklistData: BlacklistedUser | null;
            className?: string;
        },
        _ref,
    ) => {
        const { user: loggedInUser } = useAuthContext();
        const { user, uid, blacklistData, children, className } = props;

        const userConsumptionSummaries = useMemo(
            () => user?.consumptionSummaries ?? [],
            [user],
        );

        const [summaryYear, setSummaryYear] = useState<string>(() => {
            const maxYear = userConsumptionSummaries.reduce(
                (max, summary) => Math.max(max, summary.year),
                0,
            );
            return maxYear.toString();
        });

        const [selectedConsumptionSummary, setSelectedConsumptionSummary] =
            useState<ConsumptionSummary>();

        useEffect(() => {
            const summaryData = userConsumptionSummaries.find(
                (summary) => summary.year === parseInt(summaryYear),
            );
            setSelectedConsumptionSummary(summaryData);
        }, [summaryYear, userConsumptionSummaries]);

        const [isModalOpen, setIsModalOpen] = useState(false);

        const handleCloseModal = () => {
            setIsModalOpen(false);
        };

        return (
            <>
                <div
                    onClick={() => setIsModalOpen(true)}
                    className={cn(className, "mt-0")}
                >
                    {children}
                </div>
                <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>User: {uid}</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="max-h-[80vh]">
                            <p>
                                <b>Gender:</b> {user?.gender}
                            </p>
                            <p>
                                <b>Country:</b> {user?.country}
                            </p>
                            <p>
                                <b>City:</b> {user?.city ?? "N/A"}
                            </p>

                            <BorderBox className="my-4">
                                <p>
                                    Blacklisted: {blacklistData ? "yes" : "no"}
                                </p>
                                {blacklistData && (
                                    <>
                                        <p>
                                            Blacklisted Reason:{" "}
                                            {blacklistedReasonsList.find(
                                                (reason) =>
                                                    reason.key ==
                                                    blacklistData?.blacklistedReason,
                                            )?.name ?? "N/A"}
                                        </p>
                                        <p>
                                            Blacklisted At:{" "}
                                            {blacklistData.blacklistedAt
                                                ?.toDate()
                                                .toString()}
                                        </p>
                                    </>
                                )}
                            </BorderBox>

                            {selectedConsumptionSummary ? (
                                <>
                                    <Select
                                        value={summaryYear}
                                        onValueChange={setSummaryYear}
                                    >
                                        <SelectTrigger className="w-full min-w-24">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {userConsumptionSummaries.map(
                                                    (summary) => {
                                                        return (
                                                            <SelectItem
                                                                value={summary.year.toString()}
                                                                key={
                                                                    summary.year
                                                                }
                                                            >
                                                                {summary.year}
                                                            </SelectItem>
                                                        );
                                                    },
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <ConsumptionSummaryChart
                                        consumptionSummary={
                                            selectedConsumptionSummary
                                        }
                                        measure="carbonEmission"
                                    />{" "}
                                </>
                            ) : (
                                <BorderBox className="my-4">
                                    Not enough data to display summary
                                </BorderBox>
                            )}
                        </ScrollArea>
                        <DialogFooter>
                            {blacklistData ? (
                                <Button
                                    onClick={() =>
                                        unBlacklistUser(loggedInUser, uid)
                                    }
                                    className="btn btn-primary"
                                    variant="default"
                                >
                                    Unblacklist
                                </Button>
                            ) : (
                                <BlacklistUserModal uid={uid}>
                                    <Button
                                        className="btn btn-primary"
                                        variant="destructive"
                                    >
                                        Blacklist
                                    </Button>
                                </BlacklistUserModal>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>
        );
    },
);

ViewUserModal.displayName = "ViewUserModal";

export default ViewUserModal;
