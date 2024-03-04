import { ConsumptionTransportationPublicVehicleOccupancy } from "@/models/firestore/consumption/transportation/consumption-transportation-public-vehicle-occupancy";
import { ConsumptionTransportationType } from "@/models/firestore/consumption/transportation/consumption-transportation-type";
import { RecurringConsumption } from "@/models/firestore/recurring-consumption/recurring-consumption";
import { Timestamp } from "firebase/firestore";
import { z } from "zod";
import {
    consumptionSources,
    privateVehicleTypes,
    publicVehicleOccupancies,
    publicVerhicleTypes,
} from "../constants/consumptions";

const TimestampSchema = z.instanceof(Timestamp);

const transportationTypes: ConsumptionTransportationType[] =
    consumptionSources.transportation.map((source) => source.source);

const transportationPublicVehicleOccupancies: ConsumptionTransportationPublicVehicleOccupancy[] =
    publicVehicleOccupancies.map((occupancy) => occupancy.key);

export const recurringTransportationFormSchema = (
    t: (arg: string) => string,
): z.ZodType<RecurringConsumption> =>
    z.object({
        createdAt: TimestampSchema,
        isEnabled: z.boolean(),
        frequency: z
            .object({
                unit: z.enum(["daily", "weekly", "monthly"]),
                weekdays: z.array(z.coerce.number().min(1).max(7)).optional(),
                dayOfMonth: z.coerce.number().min(1).max(31).optional(),
            })
            .refine(
                (data) => {
                    if (data.unit === "weekly") {
                        return (
                            data.weekdays !== undefined &&
                            data.weekdays.length > 0
                        );
                    }
                    return true;
                },
                {
                    message: t("app.validation.error.selectAtLeastOneWeekday"),
                    path: ["weekdays"],
                },
            )
            .refine(
                (data) => {
                    if (data.unit === "monthly") {
                        return data.dayOfMonth !== undefined;
                    }
                    return true;
                },
                {
                    message: t("app.validation.error.selectDayOfMonth"),
                    path: ["dayOfMonth"],
                },
            ),
        category: z.literal("transportation"),
        transportation: z
            .object({
                transportationType: z.enum([
                    transportationTypes[0],
                    ...transportationTypes,
                ]),
                privateVehicleOccupancy: z.coerce
                    .number()
                    .min(1)
                    .max(15)
                    .optional(),
                publicVehicleOccupancy: z
                    .enum([
                        transportationPublicVehicleOccupancies[0],
                        ...transportationPublicVehicleOccupancies,
                    ])
                    .optional(),
                hourOfTravel: z.coerce.number().min(0).max(23),
                minuteOfTravel: z.coerce.number().min(0).max(59),
                distance: z.coerce.number().min(0),
            })
            .refine(
                (data) => {
                    if (privateVehicleTypes.includes(data.transportationType)) {
                        return data.privateVehicleOccupancy !== undefined;
                    }
                    return true;
                },
                {
                    message: t(
                        "app.validation.error.specifyPrivateOccupancyLevel",
                    ),
                    path: ["privateVehicleOccupancy"],
                },
            )
            .refine(
                (data) => {
                    if (publicVerhicleTypes.includes(data.transportationType)) {
                        return data.publicVehicleOccupancy !== undefined;
                    }
                    return true;
                },
                {
                    message: t(
                        "app.validation.error.specifyPublicOccupancyLevel",
                    ),
                    path: ["publicVehicleOccupancy"],
                },
            ),
        description: z.string().max(1000).optional(),
    });
