import { Consumption } from "@/models/firestore/consumption/consumption";
import { ConsumptionElectricitySource } from "@/models/firestore/consumption/electricity/consumption-electricity-source";
import { ConsumptionDistrictHeatingSource } from "@/models/firestore/consumption/heating/consumption-district-heating-source";
import { ConsumptionHeatingFuel } from "@/models/firestore/consumption/heating/consumption-heating-fuel";
import { ConsumptionTransportationPublicVehicleOccupancy } from "@/models/firestore/consumption/transportation/consumption-transportation-public-vehicle-occupancy";
import { ConsumptionTransportationType } from "@/models/firestore/consumption/transportation/consumption-transportation-type";
import { Timestamp } from "firebase/firestore";
import { z } from "zod";
import {
    consumptionSources,
    privateVehicleTypes,
    publicVehicleOccupancies,
    publicVerhicleTypes,
} from "../constants";

const TimestampSchema = z.instanceof(Timestamp);

const electricitySources: ConsumptionElectricitySource[] =
    consumptionSources.electricity.map((source) => source.source);

const heatingFuels: ConsumptionHeatingFuel[] = consumptionSources.heating.map(
    (source) => source.source,
);

const districtHeatingSources: ConsumptionDistrictHeatingSource[] =
    consumptionSources.districtHeating.map((source) => source.source);

const transportationTypes: ConsumptionTransportationType[] =
    consumptionSources.transportation.map((source) => source.source);

const transportationPublicVehicleOccupancies: ConsumptionTransportationPublicVehicleOccupancy[] =
    publicVehicleOccupancies.map((occupancy) => occupancy.key);

export const electricityFormSchema = (
    t: (arg: string) => string,
): z.ZodType<Consumption> =>
    z.object({
        value: z.coerce.number().max(100000, {
            message: t("app.validation.error.validValue"),
        }),
        category: z.literal("electricity"),
        electricity: z.object({
            electricitySource: z.enum([
                electricitySources[0],
                ...electricitySources,
            ]),
            costs: z.coerce.number().max(100000).optional(),
            householdSize: z.coerce.number().min(1).max(100),
            startDate: TimestampSchema,
            endDate: TimestampSchema,
        }),
        description: z.string().max(1000).optional(),
        createdAt: TimestampSchema,
    });

export const heatingFormSchema = (
    t: (arg: string) => string,
): z.ZodType<Consumption> =>
    z.object({
        value: z.coerce.number().max(100000, {
            message: t("app.validation.error.validValue"),
        }),
        category: z.literal("heating"),
        heating: z
            .object({
                heatingFuel: z.enum([heatingFuels[0], ...heatingFuels]),
                districtHeatingSource: z
                    .enum([
                        districtHeatingSources[0],
                        ...districtHeatingSources,
                    ])
                    .optional(),
                costs: z.coerce.number().max(100000).optional(),
                householdSize: z.coerce.number().min(1).max(100),
                startDate: TimestampSchema,
                endDate: TimestampSchema,
            })
            .refine(
                (data) => {
                    if (data.heatingFuel === "district") {
                        return data.districtHeatingSource !== undefined;
                    }
                    return true;
                },
                {
                    message:
                        "District Heating Source is required when district heating is selected",
                    path: ["districtHeatingSource"],
                },
            ),
        description: z.string().max(1000).optional(),
        createdAt: TimestampSchema,
    });

export const transportationFormSchema = (
    t: (arg: string) => string,
): z.ZodType<Consumption> =>
    z.object({
        value: z.coerce.number().max(100000, {
            message: t("app.validation.error.validValue"),
        }),
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
                dateOfTravel: TimestampSchema,
                dateOfTravelEnd: z.preprocess(
                    (date: any) => (date === null ? undefined : date),
                    TimestampSchema.optional(),
                ) as z.ZodType<Timestamp | undefined>,
            })
            .refine(
                (data) => {
                    if (privateVehicleTypes.includes(data.transportationType)) {
                        return data.privateVehicleOccupancy !== undefined;
                    }
                    return true;
                },
                {
                    message: "Please specify a number of passengers",
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
                    message: "Please specify an occupancy level",
                    path: ["publicVehicleOccupancy"],
                },
            ),
        description: z.string().max(1000).optional(),
        createdAt: TimestampSchema,
    });
