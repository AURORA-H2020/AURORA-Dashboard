import { ConsumptionTableRow } from "@/components/app/common/consumptionTableRow";
import { Table, TableBody, TableCaption } from "@/components/ui/table";
import { useFirebaseData } from "@/context/FirebaseContext";
import { carbonUnit } from "@/lib/constants/constants";
import { consumptionMapping } from "@/lib/constants/consumptions";
import { getConsumptionUnit, useConvertUnit } from "@/lib/utilities";
import { ConsumptionWithID } from "@/models/extensions";
import { useFormatter, useTranslations } from "next-intl";

/**
 * Renders a view displaying various attributes of a user's consumption
 * data in table rows, such as carbon emissions, costs, and dates.
 *
 * @param {Consumption} consumption - The consumption data to display
 * @return {React.ReactNode} A React component that renders consumption data
 */
const ConsumptionView = ({
    consumption,
}: {
    consumption: ConsumptionWithID;
}): React.ReactNode => {
    const t = useTranslations();
    const format = useFormatter();

    const { userData, userCountryData } = useFirebaseData();

    const convertedValue = useConvertUnit(
        consumption.value,
        getConsumptionUnit(
            consumption,
            userData?.settings?.unitSystem ?? "metric",
        ).firebaseUnit,
        userData?.settings?.unitSystem ?? "metric",
    );

    const convertedCarbonEmissions = useConvertUnit(
        consumption.carbonEmissions,
        "kg",
        userData?.settings?.unitSystem ?? "metric",
        carbonUnit,
    );

    const convertedFuelConsumption = useConvertUnit(
        consumption.transportation?.fuelConsumption ?? undefined,
        ["electricCar", "electricBike"].includes(
            consumption?.transportation?.transportationType ?? "",
        )
            ? "kWh/100km"
            : "L/100km",
        userData?.settings?.unitSystem ?? "metric",
    );

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
                        {convertedValue?.toString() ?? t("common.calculating")}
                    </ConsumptionTableRow>

                    <ConsumptionTableRow label={t("common.carbonEmissions")}>
                        {convertedCarbonEmissions?.toString() ??
                            t("common.calculating")}
                    </ConsumptionTableRow>
                    <ConsumptionTableRow label={t("common.energyUsage")}>
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
                                {format.number(consumption.electricity.costs, {
                                    style: "currency",
                                    currency:
                                        userCountryData?.currencyCode ?? "EUR",
                                })}
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
                                {format.number(consumption.heating.costs, {
                                    style: "currency",
                                    currency:
                                        userCountryData?.currencyCode ?? "EUR",
                                })}
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
                                {convertedFuelConsumption?.toString()}
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

export { ConsumptionView };
