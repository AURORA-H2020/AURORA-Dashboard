import Modal from "@/components/modal";
import { titleCase } from "@/lib/utilities";
import { Consumption } from "@/models/extensions";
import { ConsumptionCategory } from "@/models/userData";
import { IconBolt, IconCar, IconTemperaturePlus } from "@tabler/icons-react";
import {
    Title,
    Card,
    Grid,
    Col,
    Subtitle,
    Text,
    Color,
    ListItem,
    List,
} from "@tremor/react";
import { ReactElement, useState } from "react";

export default function ConsumptionView({
    consumption,
}: {
    consumption: Consumption;
}) {
    let consumptionIcon: ReactElement | undefined;
    let consumptionType: ConsumptionCategory;
    let consumptionUnit: string | undefined;
    let consumptionColor: Color | undefined;

    if ("electricity" in consumption) {
        consumptionIcon = <IconBolt />;
        consumptionType = "electricity";
        consumptionUnit = "kWh";
        consumptionColor = "yellow";
    } else if ("transportation" in consumption) {
        consumptionIcon = <IconCar />;
        consumptionType = "transportation";
        consumptionUnit = "km";
        consumptionColor = "blue";
    } else if ("heating" in consumption) {
        consumptionIcon = <IconTemperaturePlus />;
        consumptionType = "heating";
        consumptionUnit = "kWh";
        consumptionColor = "red";
    }
    return (
        <>
            <List>
                <ListItem>
                    <span>{titleCase(consumption.category)}</span>
                    <span>
                        {consumption.value
                            ? Math.round(consumption.value) +
                              " " +
                              String(consumptionUnit)
                            : ""}
                    </span>
                </ListItem>
                <ListItem>
                    <span>CO2-Emissions</span>
                    <span>
                        {consumption.carbonEmissions
                            ? Math.round(consumption.carbonEmissions) + " CO2"
                            : "Calculating..."}{" "}
                    </span>
                </ListItem>
                <ListItem>
                    <span>Created At</span>
                    <span>
                        {consumption.createdAt?.nanoseconds
                            ? new Date(
                                  consumption.createdAt.nanoseconds,
                              ).toDateString()
                            : ""}
                    </span>
                </ListItem>
                <ListItem>
                    <span>Updated At</span>
                    <span>
                        {consumption.updatedAt?.nanoseconds
                            ? new Date(
                                  consumption.updatedAt.nanoseconds,
                              ).toDateString()
                            : ""}
                    </span>
                </ListItem>
                <Text>
                    {consumption.generatedByRecurringConsumptionId
                        ? "Recurring consumption"
                        : ""}
                </Text>
            </List>
        </>
    );
}
