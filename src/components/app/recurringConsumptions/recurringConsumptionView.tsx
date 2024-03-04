import { RecurringConsumptionWithID } from "@/models/extensions";

import { Table, TableBody } from "@/components/ui/table";
import { weekdays } from "@/lib/constants/constants";
import { useFormatter, useTranslations } from "next-intl";
import ConsumptionTableRow from "../common/consumptionTableRow";

/**
 * Renders a view displaying various attributes of a user's consumption
 * data in table rows, such as carbon emissions, costs, and dates.
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

    return (
        <>
            <Table className="mt-4 table-fixed">
                <ConsumptionTableRow merged={true} className="font-bold">
                    {recurringConsumption.isEnabled
                        ? t("app.recurringConsumption.enabled")
                        : t("app.recurringConsumption.disabled")}
                </ConsumptionTableRow>
            </Table>
            <Table className="mt-4 table-fixed">
                <TableBody>
                    <ConsumptionTableRow label="Distance">
                        {recurringConsumption.transportation?.distance}
                    </ConsumptionTableRow>

                    <ConsumptionTableRow label="Created At">
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
                    <ConsumptionTableRow label="Frequency">
                        {t(
                            `app.recurringConsumption.frequency.${recurringConsumption.frequency.unit}`,
                        )}
                    </ConsumptionTableRow>
                    {recurringConsumption.frequency.dayOfMonth && (
                        <ConsumptionTableRow label="Day of Month">
                            {recurringConsumption.frequency.dayOfMonth}
                        </ConsumptionTableRow>
                    )}
                    {recurringConsumption.frequency.weekdays && (
                        <ConsumptionTableRow label="Weekdays">
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
                        <ConsumptionTableRow label="Time of travel">
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

                        <ConsumptionTableRow label="Transportation type">
                            {t(
                                `category.sources.${recurringConsumption.transportation.transportationType}`,
                            )}
                        </ConsumptionTableRow>

                        {recurringConsumption.transportation
                            .privateVehicleOccupancy && (
                            <ConsumptionTableRow label="Occupancy">
                                {
                                    recurringConsumption.transportation
                                        .privateVehicleOccupancy
                                }
                            </ConsumptionTableRow>
                        )}

                        {recurringConsumption.transportation
                            .publicVehicleOccupancy && (
                            <ConsumptionTableRow label="Occupancy">
                                {t(
                                    `app.consumption.publicVehicleOccupancy.${recurringConsumption.transportation.publicVehicleOccupancy}`,
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
