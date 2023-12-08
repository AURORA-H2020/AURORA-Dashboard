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
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-bold">
                            {consumptionAttributes.label}
                        </TableCell>
                        <TableCell>
                            {consumption.value
                                ? Math.round(consumption.value) +
                                  " " +
                                  String(consumptionAttributes.unit)
                                : ""}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">
                            CO2-Emissions
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Created At</TableCell>
                        <TableCell>
                            {consumption.createdAt
                                ? consumption.createdAt.toDate().toDateString()
                                : ""}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Created At</TableCell>
                        <TableCell>
                            {consumption.createdAt
                                ? consumption.createdAt.toDate().toDateString()
                                : ""}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-bold">Updated At</TableCell>
                        <TableCell>
                            {consumption.updatedAt
                                ? consumption.updatedAt.toDate().toDateString()
                                : ""}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2} className="text-center">
                            {consumption.generatedByRecurringConsumptionId
                                ? "Recurring consumption"
                                : ""}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    );
}
