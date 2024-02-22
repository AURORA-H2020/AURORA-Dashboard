"use client";
import ConsumptionPreview from "@/components/app/consumptions/consumptionPreview";
import { ConsumptionWithID } from "@/models/extensions";
import { Heading } from "@radix-ui/themes";
import { useTranslations } from "next-intl";

/**
 * Renders a list of Consumption components.
 *
 * @param {Object} props - The props object.
 * @param {Consumption[]} props.userConsumptions - The user's consumption data.
 * @return {JSX.Element} The consumption list component.
 */
function ConsumptionList({
    userConsumptions,
}: {
    userConsumptions: ConsumptionWithID[];
}): JSX.Element {
    const t = useTranslations();

    // Authenticated user content
    return (
        <div>
            <div className="mb-4 mt-8">
                <Heading weight="bold">{t("app.yourConsumptions")}</Heading>
            </div>
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
