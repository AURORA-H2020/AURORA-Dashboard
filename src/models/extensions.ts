// Assuming Consumption is imported from another module and can't be changed
import { ConsumptionSummary } from "./firestore/consumption-summary/consumption-summary";
import { Consumption } from "./firestore/consumption/consumption";
import { RecurringConsumption } from "./firestore/recurring-consumption/recurring-consumption";
import { User } from "./firestore/user/user";

// Extend the Consumption type to include the `id` property
export interface ConsumptionWithID extends Consumption {
    id: string;
}

export interface RecurringConsumptionWithID extends RecurringConsumption {
    id: string;
}

export interface ExtendedUser extends User {
    consumptions: Consumption[];
    recurringConsumptions: RecurringConsumption[];
    consumptionSummaries: ConsumptionSummary[];
}

export interface BackupUserData {
    [key: string]: ExtendedUser;
}
