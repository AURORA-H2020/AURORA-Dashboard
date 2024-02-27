import { RecurringConsumptionWithID } from "@/models/extensions";

import { Table, TableBody } from "@/components/ui/table";
import ConsumptionTableRow from "../consumptions/consumptionTableRow";

/**
 * Renders a view displaying various attributes of a user's consumption
 * data in table rows, such as carbon emissions, costs, and dates.
 *
 * @param {Consumption} consumption - The consumption data to display
 * @return {JSX.Element} A React component that renders consumption data
 */
export default function RecurringConsumptionView({
    recurringConsumption,
}: {
    recurringConsumption: RecurringConsumptionWithID;
}): JSX.Element {
    return (
        <>
            <Table className="mt-4 table-fixed">
                <TableBody>
                    <ConsumptionTableRow label="Distance">
                        {recurringConsumption.transportation?.distance}
                    </ConsumptionTableRow>

                    <ConsumptionTableRow label="Created At">
                        {recurringConsumption.createdAt
                            ?.toDate()
                            .toDateString() || ""}
                    </ConsumptionTableRow>
                    <ConsumptionTableRow label="Frequency">
                        {JSON.stringify(recurringConsumption.frequency)}
                    </ConsumptionTableRow>
                    <ConsumptionTableRow label="Enabled">
                        {recurringConsumption.isEnabled.toString()}
                    </ConsumptionTableRow>
                </TableBody>
            </Table>

            {recurringConsumption.transportation ? (
                <Table className="mt-4 table-fixed">
                    <TableBody>
                        <ConsumptionTableRow label="Hour of travel">
                            {recurringConsumption.transportation.hourOfTravel}
                        </ConsumptionTableRow>

                        <ConsumptionTableRow label="Minute of travel">
                            {recurringConsumption.transportation.minuteOfTravel}
                        </ConsumptionTableRow>

                        <ConsumptionTableRow label="Transportation type">
                            {
                                recurringConsumption.transportation
                                    .transportationType
                            }
                        </ConsumptionTableRow>

                        {recurringConsumption.transportation
                            .privateVehicleOccupancy ? (
                            <ConsumptionTableRow label="Occupancy">
                                {
                                    recurringConsumption.transportation
                                        .privateVehicleOccupancy
                                }
                            </ConsumptionTableRow>
                        ) : null}

                        {recurringConsumption.transportation
                            .publicVehicleOccupancy ? (
                            <ConsumptionTableRow label="Occupancy">
                                {
                                    recurringConsumption.transportation
                                        .publicVehicleOccupancy
                                }
                            </ConsumptionTableRow>
                        ) : null}
                    </TableBody>
                </Table>
            ) : null}

            {recurringConsumption.description ? (
                <Table className="mt-4 table-fixed">
                    <TableBody>
                        <ConsumptionTableRow merged={true}>
                            {recurringConsumption.description}
                        </ConsumptionTableRow>
                    </TableBody>
                </Table>
            ) : null}

            <Table className="mt-4 mb-4 table-fixed">
                <TableBody>
                    <ConsumptionTableRow label="Created At">
                        {recurringConsumption.createdAt
                            ?.toDate()
                            .toDateString() || ""}
                    </ConsumptionTableRow>
                </TableBody>
            </Table>
        </>
    );
}
