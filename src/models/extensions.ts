// Assuming Consumption is imported from another module and can't be changed
import { Consumption } from "./firestore/consumption/consumption";

// Extend the Consumption type to include the `id` property
export interface ConsumptionWithID extends Consumption {
    id: string;
}
