import { Consumption } from "@/models/firestore/consumption/consumption";
import { Timestamp } from "firebase/firestore";
import { z } from "zod";
import { consumptionSources } from "../constants";
import { ConsumptionElectricitySource } from "@/models/firestore/consumption/electricity/consumption-electricity-source";

const TimestampSchema = z.instanceof(Timestamp);

const sources: ConsumptionElectricitySource[] =
    consumptionSources.electricity.map((source) => source.source);

export const ElectricityFormSchema: z.ZodType<Consumption> = z.object({
    value: z.coerce.number().max(1000000, {
        message: "Please enter a valid number.",
    }),
    category: z.literal("electricity"),
    electricity: z.object({
        electricitySource: z.enum([sources[0], ...sources]),
        costs: z.coerce.number().max(1000000),
        householdSize: z.coerce.number().min(1).max(100),
        startDate: TimestampSchema,
        endDate: TimestampSchema,
    }),
    description: z.string().max(1000).optional(),
    createdAt: TimestampSchema,
});
