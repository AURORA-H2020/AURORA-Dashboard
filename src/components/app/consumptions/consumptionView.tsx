import ConsumptionTableRow from "@/components/app/common/consumptionTableRow";
import { Table, TableBody, TableCaption } from "@/components/ui/table";
import { carbonUnit } from "@/lib/constants/constants";
import { consumptionMapping } from "@/lib/constants/consumptions";
import { ConsumptionWithID } from "@/models/extensions";
import { useFormatter, useTranslations } from "next-intl";

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
                        {format.number(consumption.value, {
                            maximumFractionDigits: 1,
                        }) +
                            " " +
                            consumptionAttributes?.unit}
                    </ConsumptionTableRow>

                    <ConsumptionTableRow
                        label={
                            // t("common.co2emission")
                            t.rich("common.co2emission", {
                                sub: (chunks) => (
                                    <sub className="mr-1">{chunks}</sub>
                                ),
                            })
                        }
                    >
                        {consumption.carbonEmissions
                            ? format.number(consumption.carbonEmissions, {
                                  maximumFractionDigits: 1,
                              }) + carbonUnit
                            : t("common.calculating")}
                    </ConsumptionTableRow>
                    <ConsumptionTableRow label={t("unitLabel.eneryUsage")}>
                        {consumption.energyExpended
                            ? format.number(consumption.energyExpended, {
                                  maximumFractionDigits: 1,
                              }) + " kWh"
                            : t("common.calculating")}
                    </ConsumptionTableRow>
                </TableBody>
            </Table>

            {consumption.electricity ? (
                <Table className="mt-4 table-fixed">
                    <TableBody>
                        {consumption.electricity.costs && (
                            <ConsumptionTableRow label={t("app.form.costs")}>
                                {consumption.electricity.costs}
                            </ConsumptionTableRow>
                        )}
                        {consumption.electricity.electricityExported && (
                            <ConsumptionTableRow
                                label={t("app.form.electricityExported")}
                            >
                                {consumption.electricity.electricityExported +
                                    " kWh"}
                            </ConsumptionTableRow>
                        )}

                        <ConsumptionTableRow
                            label={t("app.form.peopleInHousehold")}
                        >
                            {consumption.electricity.householdSize}
                        </ConsumptionTableRow>
                        <ConsumptionTableRow
                            label={t("app.form.electricitySource")}
                        >
                            {t(
                                `category.sources.${consumption.electricity.electricitySource}`,
                            )}
                        </ConsumptionTableRow>
                        <ConsumptionTableRow label={t("ui.monthPicker.start")}>
                            {format.dateTime(
                                consumption.electricity.startDate.toDate(),
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                },
                            )}
                        </ConsumptionTableRow>
                        <ConsumptionTableRow label={t("ui.monthPicker.end")}>
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
                            <ConsumptionTableRow label={t("app.form.costs")}>
                                {consumption.heating.costs}
                            </ConsumptionTableRow>
                        )}

                        <ConsumptionTableRow
                            label={t("app.form.peopleInHousehold")}
                        >
                            {consumption.heating.householdSize}
                        </ConsumptionTableRow>
                        <ConsumptionTableRow
                            label={t("app.form.heating.heatingFuel")}
                        >
                            {t(
                                `category.sources.${consumption.heating.heatingFuel}`,
                            )}
                        </ConsumptionTableRow>

                        {consumption.heating.districtHeatingSource && (
                            <ConsumptionTableRow
                                label={t(
                                    "app.form.heating.districtHeatingSource",
                                )}
                            >
                                {t(
                                    `category.sources.${consumption.heating.districtHeatingSource}`,
                                )}
                            </ConsumptionTableRow>
                        )}

                        <ConsumptionTableRow label={t("ui.monthPicker.start")}>
                            {format.dateTime(
                                consumption.heating.startDate?.toDate(),
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                },
                            )}
                        </ConsumptionTableRow>
                        <ConsumptionTableRow label={t("ui.monthPicker.end")}>
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
                        <ConsumptionTableRow
                            label={t("app.form.startOfTravel")}
                        >
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
                            <ConsumptionTableRow
                                label={t("app.form.endOfTravel")}
                            >
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

                        <ConsumptionTableRow
                            label={t("app.form.transportationType")}
                        >
                            {t(
                                `category.sources.${consumption.transportation.transportationType}`,
                            )}
                        </ConsumptionTableRow>

                        {consumption.transportation.fuelConsumption && (
                            <ConsumptionTableRow
                                label={t("app.form.fuelConsumption")}
                            >
                                {consumption.transportation.fuelConsumption}
                            </ConsumptionTableRow>
                        )}

                        {consumption.transportation.privateVehicleOccupancy && (
                            <ConsumptionTableRow
                                label={t("app.form.occupancy")}
                            >
                                {
                                    consumption.transportation
                                        .privateVehicleOccupancy
                                }
                            </ConsumptionTableRow>
                        )}

                        {consumption.transportation.publicVehicleOccupancy && (
                            <ConsumptionTableRow
                                label={t("app.form.occupancy")}
                            >
                                {t(
                                    `app.form.publicVehicleOccupancy.${consumption.transportation.publicVehicleOccupancy}`,
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
                    <ConsumptionTableRow label={t("app.form.createdAt")}>
                        {format.dateTime(consumption.createdAt.toDate(), {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                        })}
                    </ConsumptionTableRow>
                    {consumption.updatedAt && (
                        <ConsumptionTableRow label={t("app.form.updatedAt")}>
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
                        {t("app.form.recurringAutomaticDisclaimer")}
                    </TableCaption>
                )}
            </Table>
        </>
    );
};

export default ConsumptionView;
