import { Table, TableBody, TableCaption } from "@/components/ui/table";
import { carbonUnit, consumptionMapping } from "@/lib/constants";
import { ConsumptionWithID } from "@/models/extensions";
import { useFormatter, useTranslations } from "next-intl";
import ConsumptionTableRow from "../common/consumptionTableRow";

/**
 * Renders a view displaying various attributes of a user's consumption
 * data in table rows, such as carbon emissions, costs, and dates.
 *
 * @param {Consumption} consumption - The consumption data to display
 * @return {JSX.Element} A React component that renders consumption data
 */
const ConsumptionView = ({
    consumption,
}: {
    consumption: ConsumptionWithID;
}): JSX.Element => {
    const t = useTranslations();
    const format = useFormatter();

    const consumptionAttributes = consumptionMapping.find(
        (c) => c.category == consumption.category,
    );

    return (
        <>
            <Table className="mt-4 table-fixed">
                <TableBody>
                    <ConsumptionTableRow
                        label={t(consumptionAttributes?.unitLabel) ?? ""}
                    >
                        {format.number(consumption.value) +
                            " " +
                            consumptionAttributes?.unit}
                    </ConsumptionTableRow>
                    <ConsumptionTableRow label="CO2-Emissions">
                        {consumption.carbonEmissions
                            ? format.number(consumption.carbonEmissions, {
                                  maximumFractionDigits: 1,
                              }) + carbonUnit
                            : t("common.calculating")}
                    </ConsumptionTableRow>
                </TableBody>
            </Table>

            {consumption.electricity ? (
                <Table className="mt-4 table-fixed">
                    <TableBody>
                        {consumption.electricity.costs && (
                            <ConsumptionTableRow label="Costs">
                                {consumption.electricity.costs}
                            </ConsumptionTableRow>
                        )}

                        <ConsumptionTableRow label="People in household">
                            {consumption.electricity.householdSize}
                        </ConsumptionTableRow>
                        <ConsumptionTableRow label="Electricity source">
                            {t(
                                `category.sources.${consumption.electricity.electricitySource}`,
                            )}
                        </ConsumptionTableRow>
                        <ConsumptionTableRow label="Beginning">
                            {format.dateTime(
                                consumption.electricity.startDate.toDate(),
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                },
                            )}
                        </ConsumptionTableRow>
                        <ConsumptionTableRow label="End">
                            {format.dateTime(
                                consumption.electricity.endDate.toDate(),
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                },
                            )}
                        </ConsumptionTableRow>
                    </TableBody>
                </Table>
            ) : null}

            {consumption.heating ? (
                <Table className="mt-4 table-fixed">
                    <TableBody>
                        {consumption.heating.costs && (
                            <ConsumptionTableRow label="Costs">
                                {consumption.heating.costs}
                            </ConsumptionTableRow>
                        )}

                        <ConsumptionTableRow label="People in household">
                            {consumption.heating.householdSize}
                        </ConsumptionTableRow>
                        <ConsumptionTableRow label="Heating source">
                            {t(
                                `category.sources.${consumption.heating.heatingFuel}`,
                            )}
                        </ConsumptionTableRow>

                        {consumption.heating.districtHeatingSource && (
                            <ConsumptionTableRow label="District heating fuel">
                                {t(
                                    `category.sources.${consumption.heating.districtHeatingSource}`,
                                )}
                            </ConsumptionTableRow>
                        )}

                        <ConsumptionTableRow label="Beginning">
                            {format.dateTime(
                                consumption.heating.startDate?.toDate(),
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                },
                            )}
                        </ConsumptionTableRow>
                        <ConsumptionTableRow label="End">
                            {format.dateTime(
                                consumption.heating.startDate?.toDate(),
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                },
                            )}
                        </ConsumptionTableRow>
                    </TableBody>
                </Table>
            ) : null}

            {consumption.transportation && (
                <Table className="mt-4 table-fixed">
                    <TableBody>
                        <ConsumptionTableRow label="Start of travel">
                            {format.dateTime(
                                consumption.transportation.dateOfTravel.toDate(),
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                },
                            )}
                        </ConsumptionTableRow>

                        {consumption.transportation.dateOfTravelEnd ? (
                            <ConsumptionTableRow label="End of travel">
                                {format.dateTime(
                                    consumption.transportation.dateOfTravelEnd.toDate(),
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                    },
                                )}
                            </ConsumptionTableRow>
                        ) : null}

                        <ConsumptionTableRow label="Transportation type">
                            {t(
                                `category.sources.${consumption.transportation.transportationType}`,
                            )}
                        </ConsumptionTableRow>

                        {consumption.transportation.privateVehicleOccupancy && (
                            <ConsumptionTableRow label="Occupancy">
                                {
                                    consumption.transportation
                                        .privateVehicleOccupancy
                                }
                            </ConsumptionTableRow>
                        )}

                        {consumption.transportation.publicVehicleOccupancy && (
                            <ConsumptionTableRow label="Occupancy">
                                {t(
                                    `app.consumption.publicVehicleOccupancy.${consumption.transportation.publicVehicleOccupancy}`,
                                )}
                            </ConsumptionTableRow>
                        )}
                    </TableBody>
                </Table>
            )}

            {consumption.description && (
                <Table className="mt-4 table-fixed">
                    <TableBody>
                        <ConsumptionTableRow merged={true}>
                            {consumption.description}
                        </ConsumptionTableRow>
                    </TableBody>
                </Table>
            )}

            <Table className="mt-4 mb-4 table-fixed">
                <TableBody>
                    <ConsumptionTableRow label="Created At">
                        {format.dateTime(consumption.createdAt.toDate(), {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                        })}
                    </ConsumptionTableRow>
                    {consumption.updatedAt && (
                        <ConsumptionTableRow label="Updated At">
                            {format.dateTime(consumption.updatedAt?.toDate(), {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                            })}
                        </ConsumptionTableRow>
                    )}
                </TableBody>

                {consumption.generatedByRecurringConsumptionId && (
                    <TableCaption>
                        This entry was automatically added via recurring
                        consumptions.
                    </TableCaption>
                )}
            </Table>
        </>
    );
};

export default ConsumptionView;
