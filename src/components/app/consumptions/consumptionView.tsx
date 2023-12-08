import { getConsumptionAttributes } from "@/lib/utilities";
import { Consumption } from "@/models/extensions";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { carbonUnit, kiloGramNumberFormatter } from "@/lib/constants";

export default function ConsumptionView({
    consumption,
}: {
    consumption: Consumption;
}) {
    const consumptionAttributes = getConsumptionAttributes(consumption);

    return (
        <>
            <Table className="mt-4 table-fixed">
                <TableBody>
                    <ConsumptionTableRow label={consumptionAttributes.label}>
                        {consumption.carbonEmissions ? (
                            <>
                            {consumption.value
                                    ? Math.round(
                                          consumption.energyExpended || 0,
                                      ) +
                                  " " +
                                  String(consumptionAttributes.unit)
                                : ""}
                            </>
                        ) : (
                            "Calculating..."
                        )}{" "}
                    </ConsumptionTableRow>
                    <ConsumptionTableRow label="CO2-Emissions">
                            {consumption.carbonEmissions ? (
                                <>
                                    {kiloGramNumberFormatter.format(
                                        consumption.carbonEmissions,
                                    )}
                                    {carbonUnit}
                                </>
                            ) : (
                                "Calculating..."
                            )}{" "}
                    </ConsumptionTableRow>

                    <ConsumptionTableRow label="Created At">
                        {consumption.createdAt?.toDate().toDateString() || ""}
                    </ConsumptionTableRow>
                    <ConsumptionTableRow label="Updated At">
                        {consumption.updatedAt?.toDate().toDateString() || ""}
                    </ConsumptionTableRow>
                </TableBody>
            </Table>

            {consumption.electricity ? (
                <Table className="mt-4 table-fixed">
                    <TableBody>
                        {consumption.electricity.costs ? (
                            <ConsumptionTableRow label="Costs">
                                {consumption.electricity.costs}
                            </ConsumptionTableRow>
                        ) : null}

                        <ConsumptionTableRow label="People in household">
                            {consumption.electricity.householdSize}
                        </ConsumptionTableRow>
                        <ConsumptionTableRow label="Electricity source">
                            {consumption.electricity.electricitySource}
                        </ConsumptionTableRow>
                        <ConsumptionTableRow label="Beginning">
                            {consumption.electricity.startDate
                                ?.toDate()
                                .toDateString()}
                        </ConsumptionTableRow>
                        <ConsumptionTableRow label="End">
                            {consumption.electricity.startDate
                                ?.toDate()
                                .toDateString()}
                        </ConsumptionTableRow>
                </TableBody>
            </Table>
            ) : null}

            {consumption.heating ? (
                <Table className="mt-4 table-fixed">
                    <TableBody>
                        {consumption.heating.costs ? (
                            <ConsumptionTableRow label="Costs">
                                {consumption.heating.costs}
                            </ConsumptionTableRow>
                        ) : null}

                        <ConsumptionTableRow label="People in household">
                            {consumption.heating.householdSize}
                        </ConsumptionTableRow>
                        <ConsumptionTableRow label="Heating source">
                            {consumption.heating.heatingFuel}
                        </ConsumptionTableRow>

                        {consumption.heating.districtHeatingSource ? (
                            <ConsumptionTableRow label="District heating fuel">
                                {consumption.heating.districtHeatingSource}
                            </ConsumptionTableRow>
                        ) : null}

                        <ConsumptionTableRow label="Beginning">
                            {consumption.heating.startDate
                                ?.toDate()
                                .toDateString()}
                        </ConsumptionTableRow>
                        <ConsumptionTableRow label="End">
                            {consumption.heating.startDate
                                ?.toDate()
                                .toDateString()}
                        </ConsumptionTableRow>
                    </TableBody>
                </Table>
            ) : null}

            {consumption.transportation ? (
                <Table className="mt-4 table-fixed">
                    <TableBody>
                        <ConsumptionTableRow label="Start of travel">
                            {consumption.transportation.dateOfTravel
                                .toDate()
                                .toDateString()}
                        </ConsumptionTableRow>

                        {consumption.transportation.dateOfTravelEnd ? (
                            <ConsumptionTableRow label="End of travel">
                                {consumption.transportation.dateOfTravelEnd
                                    .toDate()
                                    .toDateString()}
                            </ConsumptionTableRow>
                        ) : null}

                        <ConsumptionTableRow label="Transportation type">
                            {consumption.transportation.transportationType}
                        </ConsumptionTableRow>

                        {consumption.transportation.privateVehicleOccupancy ? (
                            <ConsumptionTableRow label="Occupancy">
                                {
                                    consumption.transportation
                                        .privateVehicleOccupancy
                                }
                            </ConsumptionTableRow>
                        ) : null}

                        {consumption.transportation.publicVehicleOccupancy ? (
                            <ConsumptionTableRow label="Occupancy">
                                {
                                    consumption.transportation
                                        .publicVehicleOccupancy
                                }
                            </ConsumptionTableRow>
                        ) : null}
                    </TableBody>
                </Table>
            ) : null}

            {consumption.description ? (
                <Table className="mt-4 table-fixed">
                    <TableBody>
                        <ConsumptionTableRow merged={true}>
                            {consumption.description}
                        </ConsumptionTableRow>
                    </TableBody>
                </Table>
            ) : null}

            <Table className="mt-4 mb-4 table-fixed">
                <TableBody>
                    <ConsumptionTableRow label="Created At">
                        {consumption.createdAt?.toDate().toDateString() || ""}
                    </ConsumptionTableRow>
                    <ConsumptionTableRow label="Updated At">
                        {consumption.updatedAt?.toDate().toDateString() || ""}
                    </ConsumptionTableRow>
                </TableBody>
                <TableCaption>
                    {consumption.generatedByRecurringConsumptionId
                        ? "This entry was automatically added via recurring consumptions."
                        : null}
                </TableCaption>
            </Table>
        </>
    );
}
