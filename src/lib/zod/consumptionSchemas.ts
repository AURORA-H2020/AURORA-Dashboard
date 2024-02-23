import { Consumption } from "@/models/firestore/consumption/consumption";
import { ConsumptionElectricitySource } from "@/models/firestore/consumption/electricity/consumption-electricity-source";
import { Timestamp } from "firebase/firestore";
import { z } from "zod";
import { consumptionSources } from "../constants";

const TimestampSchema = z.instanceof(Timestamp);

const sources: ConsumptionElectricitySource[] =
    consumptionSources.electricity.map((source) => source.source);

export const electricityFormSchema = (
    t: (arg: string) => string,
): z.ZodType<Consumption> =>
    z.object({
        value: z.coerce.number().max(1000000, {
            message: t("app.validation.error.validValue"),
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
