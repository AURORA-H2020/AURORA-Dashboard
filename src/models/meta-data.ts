import { ReactElement } from "react";
import { ConsumptionCategory } from "./firestore/consumption/consumption-category";

export interface ConsumptionAttributes {
    icon: ReactElement;
    category: ConsumptionCategory;
    label: string;
    unit: string;
    colorPrimary: string;
    unitLabel: string;
}
