import { ConsumptionElectricitySource } from "./firestore/consumption/electricity/consumption-electricity-source";
import { ConsumptionHeatingFuel } from "./firestore/consumption/heating/consumption-heating-fuel";
import { ConsumptionTransportationType } from "./firestore/consumption/transportation/consumption-transportation-type";

export interface ConsumptionSources {
    electricity: { source: ConsumptionElectricitySource; name: string }[];
    heating: { source: ConsumptionHeatingFuel; name: string }[];
    transportation: { source: ConsumptionTransportationType; name: string }[];
}
