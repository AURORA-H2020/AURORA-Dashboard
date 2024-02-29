"use client";

import ConsumptionPreview from "@/components/app/consumptions/consumptionPreview";
import { useFirebaseData } from "@/context/FirebaseContext";
import { cn } from "@/lib/utilities";
import { Grid } from "@radix-ui/themes";
import ConsumptionPlaceholder from "../common/consumptionPlaceholder";

/**
 * Renders a list of Consumption components.
 *
 * @param {Object} props - The props object.
 * @param {Consumption[]} props.userConsumptions - The user's consumption data.
 * @return {JSX.Element} The consumption list component.
 */
const ConsumptionList = ({
    className,
}: {
    className?: string;
}): JSX.Element => {
    const { userConsumptions } = useFirebaseData();

    if (!userConsumptions || userConsumptions.length === 0) {
        return (
            <ConsumptionPlaceholder>
                No consumptions found.
            </ConsumptionPlaceholder>
        );
    }

    return (
        <Grid className={cn(className)} gap="4">
            {userConsumptions &&
                userConsumptions.map((consumption) => (
                    <ConsumptionPreview
                        key={consumption.id}
                        consumption={consumption}
                    />
                ))}
        </Grid>
    );
};

export default ConsumptionList;
