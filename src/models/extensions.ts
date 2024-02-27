// Assuming Consumption is imported from another module and can't be changed
import { Consumption } from "./firestore/consumption/consumption";
import { RecurringConsumption } from "./firestore/recurring-consumption/recurring-consumption";

// Extend the Consumption type to include the `id` property
export interface ConsumptionWithID extends Consumption {
    id: string;
}

export interface RecurringConsumptionWithID extends RecurringConsumption {
    id: string;
}
