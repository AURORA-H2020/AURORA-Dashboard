"use client";

import ConsumptionPreview from "@/components/app/consumptions/consumptionPreview";
import LoadingSpinner from "@/components/ui/loading";
import { useFirebaseData } from "@/context/FirebaseContext";
import { cn } from "@/lib/utilities";

/**
 * Renders a list of Consumption components.
 *
 * @param {Object} props - The props object.
 * @param {Consumption[]} props.userConsumptions - The user's consumption data.
 * @return {JSX.Element} The consumption list component.
 */
function ConsumptionList({ className }: { className?: string }): JSX.Element {
    const { userConsumptions } = useFirebaseData();

    if (!userConsumptions) {
        return <LoadingSpinner />;
    }

    return (
        <div className={cn(className)}>
            {userConsumptions &&
                userConsumptions.map((consumption) => (
                    <div className="mb-4" key={consumption.id}>
                        <ConsumptionPreview consumption={consumption} />
                    </div>
                ))}
        </div>
    );
}

export default ConsumptionList;
