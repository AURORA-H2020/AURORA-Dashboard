"use client";

import { useFirebaseData } from "@/context/FirebaseContext";
import { cn } from "@/lib/utilities";
import ConsumptionPlaceholder from "../common/consumptionPlaceholder";
import RecurringConsumptionPreview from "./recurringConsumptionPreview";

/**
 * Renders a list of Consumption components.
 *
 * @param {Object} props - The props object.
 * @param {Consumption[]} props.userConsumptions - The user's consumption data.
 * @return {JSX.Element} The consumption list component.
 */
function RecurringConsumptionList({
    className,
}: {
    className?: string;
}): JSX.Element {
    const { userRecurringConsumptions } = useFirebaseData();

    if (!userRecurringConsumptions || userRecurringConsumptions.length === 0) {
        return (
            <ConsumptionPlaceholder>
                No consumptions found.
            </ConsumptionPlaceholder>
        );
    }

    return (
        <div className={cn(className)}>
            {userRecurringConsumptions &&
                userRecurringConsumptions.map((recurringConsumption) => (
                    <div className="mb-4" key={recurringConsumption.id}>
                        <RecurringConsumptionPreview
                            recurringConsumption={recurringConsumption}
                        />
                    </div>
                ))}
        </div>
    );
}

export default RecurringConsumptionList;
