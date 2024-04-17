"use client";

import ConsumptionTableRow from "@/components/app/common/consumptionTableRow";
import { Table, TableBody } from "@/components/ui/table";
import { useFirebaseData } from "@/context/FirebaseContext";
import { weekdays } from "@/lib/constants/constants";
import { useConvertUnit } from "@/lib/utilities";
import { RecurringConsumptionWithID } from "@/models/extensions";
import { useFormatter, useTranslations } from "next-intl";

/**
 * Renders a view displaying various attributes of a user's consumption
 * data in table rows, such as carbon emissions and dates.
 *
 * @param {Consumption} consumption - The consumption data to display
 * @return {JSX.Element} A React component that renders consumption data
 */
const RecurringConsumptionView = ({
    recurringConsumption,
}: {
    recurringConsumption: RecurringConsumptionWithID;
}): JSX.Element => {
    const t = useTranslations();
    const format = useFormatter();

    const { userData } = useFirebaseData();

    const convertedValue = useConvertUnit(
        recurringConsumption.transportation?.distance,
        "km",
        userData?.settings?.unitSystem ?? "metric",
    );

    const convertedFuelConsumption = useConvertUnit(
        recurringConsumption.transportation?.fuelConsumption ?? undefined,
        ["electricCar", "electricBike"].includes(
            recurringConsumption?.transportation?.transportationType ?? "",
        )
            ? "kWh/100km"
            : "L/100km",
        userData?.settings?.unitSystem ?? "metric",
    );

    return (
        <>
            <Table className="mt-4 table-fixed">
                <ConsumptionTableRow merged={true} className="font-bold">
                    {recurringConsumption.isEnabled
                        ? t("app.form.enabled")
                        : t("app.form.disabled")}
                </ConsumptionTableRow>
            </Table>
            <Table className="mt-4 table-fixed">
                <TableBody>
                    <ConsumptionTableRow label={t("unitLabel.distance")}>
                        {convertedValue?.toString() ?? t("common.calculating")}
                    </ConsumptionTableRow>

                    <ConsumptionTableRow label={t("app.form.createdAt")}>
                        {format.dateTime(
                            recurringConsumption.createdAt?.toDate(),
                            {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                            },
                        )}
                    </ConsumptionTableRow>
                    <ConsumptionTableRow label={t("app.form.frequency")}>
                        {t(
                            `app.form.frequencyOptions.${recurringConsumption.frequency.unit}`,
                        )}
                    </ConsumptionTableRow>
                    {recurringConsumption.frequency.dayOfMonth && (
                        <ConsumptionTableRow label={t("app.form.dayOfMonth")}>
                            {recurringConsumption.frequency.dayOfMonth}
                        </ConsumptionTableRow>
                    )}
                    {recurringConsumption.frequency.weekdays && (
                        <ConsumptionTableRow label={t("app.form.weekdays")}>
                            {recurringConsumption.frequency.weekdays
                                ?.map((day) => t(weekdays[day - 1]?.label))
                                .join(", ")}
                        </ConsumptionTableRow>
                    )}
                </TableBody>
            </Table>

            {recurringConsumption.transportation ? (
                <Table className="mt-4 table-fixed">
                    <TableBody>
                        <ConsumptionTableRow label={t("app.form.timeOfTravel")}>
                            {format.dateTime(
                                new Date().setHours(
                                    recurringConsumption.transportation
                                        .hourOfTravel,
                                    recurringConsumption.transportation
                                        .minuteOfTravel,
                                ),
                                {
                                    hour: "numeric",
                                    minute: "numeric",
                                },
                            )}
                        </ConsumptionTableRow>

                        <ConsumptionTableRow
                            label={t("app.form.transportationType")}
                        >
                            {t(
                                `category.sources.${recurringConsumption.transportation.transportationType}`,
                            )}
                        </ConsumptionTableRow>

                        {recurringConsumption.transportation
                            .fuelConsumption && (
                            <ConsumptionTableRow
                                label={t("app.form.fuelConsumption")}
                            >
                                {convertedFuelConsumption?.toString()}
                            </ConsumptionTableRow>
                        )}

                        {recurringConsumption.transportation
                            .privateVehicleOccupancy && (
                            <ConsumptionTableRow
                                label={t("app.form.occupancy")}
                            >
                                {
                                    recurringConsumption.transportation
                                        .privateVehicleOccupancy
                                }
                            </ConsumptionTableRow>
                        )}

                        {recurringConsumption.transportation
                            .publicVehicleOccupancy && (
                            <ConsumptionTableRow
                                label={t("app.form.occupancy")}
                            >
                                {t(
                                    `app.form.publicVehicleOccupancy.${recurringConsumption.transportation.publicVehicleOccupancy}`,
                                )}
                            </ConsumptionTableRow>
                        )}
                    </TableBody>
                </Table>
            ) : null}

            {recurringConsumption.description && (
                <Table className="mt-4 table-fixed">
                    <TableBody>
                        <ConsumptionTableRow merged={true}>
                            {recurringConsumption.description}
                        </ConsumptionTableRow>
                    </TableBody>
                </Table>
            )}
        </>
    );
};

export default RecurringConsumptionView;
