"use client";

import { BorderBox } from "@/components/app/common/borderBox";
import { ConsumptionSummaryChart } from "@/components/app/summary/consumptionSummaryChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { unBlacklistUser } from "@/firebase/admin/handle-blacklist";
import { blacklistedReasonsList } from "@/lib/constants/admin-constants";
import { cn } from "@/lib/utilities";
import { ExtendedUser } from "@/models/extensions";
import { BlacklistedUser } from "@/models/firestore/_export-user-data-blacklisted-users/blacklisted-user";
import { ConsumptionSummary } from "@/models/firestore/consumption-summary/consumption-summary";
import { useAuthContext } from "@/providers/context/authContext";
import { Flex, Grid } from "@radix-ui/themes";
import { useFormatter } from "next-intl";
import { forwardRef, ReactNode, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BlacklistUserModal } from "./blacklistUser";

const ViewUserModal = forwardRef(
  (
    props: {
      children: ReactNode;
      user: ExtendedUser;
      uid: string;
      blacklistData: BlacklistedUser | null;
      className?: string;
    },
    _ref,
  ) => {
    const { user: loggedInUser } = useAuthContext();
    const { user, uid, blacklistData, children, className } = props;

    const format = useFormatter();

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
          <DialogContent className="sm:max-w-[1000px]">
            <DialogHeader>
              <Flex direction="row" justify="between" align="center">
                <DialogTitle>User: {uid}</DialogTitle>
                <Button
                  variant="outline"
                  className="mr-8 w-24"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(`users/${uid}`)
                      .then(() => toast.success("Path copied"))
                  }
                >
                  Copy Path
                </Button>
              </Flex>
            </DialogHeader>
            <ScrollArea className="max-h-[80vh]">
              <Grid gap="2" columns="3">
                <Card className="m-2">
                  <CardHeader className="pb-6 font-bold">User data</CardHeader>
                  <CardContent>
                    <p>
                      <b>Gender:</b> {user?.gender}
                    </p>
                    <p>
                      <b>Country:</b> {user?.country}
                    </p>
                    <p>
                      <b>City:</b> {user?.city ?? "N/A"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="m-2">
                  <CardHeader className="pb-6 font-bold">
                    Consumption Metadata
                  </CardHeader>
                  <CardContent>
                    <p>
                      <b>Consumption Version:</b>{" "}
                      {user.consumptionMeta?.version ?? "N/A"}
                    </p>
                    <p>
                      <b>Summary Recalulation:</b>{" "}
                      {user.consumptionMeta?.lastRecalculation
                        ? format.dateTime(
                            new Date(
                              user.consumptionMeta?.lastRecalculation[
                                "_seconds"
                              ] * 1000,
                            ),
                          )
                        : "N/A"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="m-2">
                  <CardHeader className="pb-6 font-bold">
                    Summary Metadata
                  </CardHeader>
                  <CardContent>
                    <p>
                      <b>Summary Version:</b>{" "}
                      {user.consumptionSummaryMeta?.version ?? "N/A"}
                    </p>
                    <p>
                      <b>Summary Recalulation:</b>{" "}
                      {user.consumptionSummaryMeta?.lastRecalculation
                        ? format.dateTime(
                            new Date(
                              user.consumptionSummaryMeta?.lastRecalculation[
                                "_seconds"
                              ] * 1000,
                            ),
                          )
                        : "N/A"}
                    </p>
                  </CardContent>
                </Card>
              </Grid>

              <BorderBox className="my-4">
                <p>Blacklisted: {blacklistData ? "yes" : "no"}</p>
                {blacklistData && (
                  <>
                    <p>
                      Blacklisted Reason:{" "}
                      {blacklistedReasonsList.find(
                        (reason) =>
                          reason.key == blacklistData?.blacklistedReason,
                      )?.name ?? "N/A"}
                    </p>
                    <p>
                      Blacklisted At:{" "}
                      {blacklistData.blacklistedAt?.toDate().toString()}
                    </p>
                  </>
                )}
              </BorderBox>

              {selectedConsumptionSummary ? (
                <>
                  <Select value={summaryYear} onValueChange={setSummaryYear}>
                    <SelectTrigger className="w-full min-w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {userConsumptionSummaries.map((summary) => {
                          return (
                            <SelectItem
                              value={summary.year.toString()}
                              key={summary.year}
                            >
                              {summary.year}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <ConsumptionSummaryChart
                    consumptionSummary={selectedConsumptionSummary}
                    measure="carbonEmission"
                  />{" "}
                </>
              ) : (
                <BorderBox className="my-4">
                  Not enough data to display summary
                </BorderBox>
              )}
              {user.consumptions.length > 0 && (
                <>
                  <span className="text-xl font-bold">Top 10 Consumptions</span>
                  <Grid columns="2" gap="2">
                    {user.consumptions
                      .sort((a, b) =>
                        (a.carbonEmissions ?? 0) > (b.carbonEmissions ?? 0)
                          ? -1
                          : 1,
                      )
                      .slice(0, 10)
                      .map((consumption) => (
                        <Card
                          key={consumption.createdAt.toString()}
                          className="m-2"
                        >
                          <CardHeader className="pb-6 font-bold">
                            <span>{`${consumption.category}: ${
                              consumption.transportation?.transportationType ??
                              consumption.electricity?.electricitySource ??
                              consumption.heating?.heatingFuel
                            }`}</span>
                          </CardHeader>
                          <CardContent>
                            <Grid columns="2">
                              <div>
                                Carbon Emissions:{" "}
                                {Math.floor(consumption.carbonEmissions ?? 0)}
                              </div>
                              <div>
                                Energy Expended:{" "}
                                {Math.floor(consumption.energyExpended ?? 0)}
                              </div>
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                  </Grid>
                </>
              )}
            </ScrollArea>
            <DialogFooter>
              {blacklistData ? (
                <Button
                  onClick={() =>
                    unBlacklistUser(loggedInUser, uid).then((success) =>
                      success
                        ? toast.success("User unblacklisted")
                        : toast.error("Error unblacklisting user"),
                    )
                  }
                  className="btn btn-primary"
                  variant="default"
                >
                  Unblacklist
                </Button>
              ) : (
                <BlacklistUserModal uid={uid}>
                  <Button className="btn btn-primary" variant="destructive">
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

export { ViewUserModal };
