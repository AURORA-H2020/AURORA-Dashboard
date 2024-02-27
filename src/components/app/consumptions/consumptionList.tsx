"use client";

import ConsumptionPreview from "@/components/app/consumptions/consumptionPreview";
import LoadingSpinner from "@/components/ui/loading";
import { useFirebaseData } from "@/context/FirebaseContext";
import { Flex, Heading } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import AddEditConsumptionModal from "./addEdit/addEditConsumptionModal";
import { Button } from "@/components/ui/button";

/**
 * Renders a list of Consumption components.
 *
 * @param {Object} props - The props object.
 * @param {Consumption[]} props.userConsumptions - The user's consumption data.
 * @return {JSX.Element} The consumption list component.
 */
function ConsumptionList(): JSX.Element {
    const t = useTranslations();

    const { userConsumptions } = useFirebaseData();

    if (!userConsumptions) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <div className="mb-4 mt-8">
                <Flex
                    justify="between"
                    align={{ initial: "start", xs: "center" }}
                    direction={{ initial: "column", xs: "row" }}
                    className="gap-2"
                >
                    <Heading weight="bold">{t("app.yourConsumptions")}</Heading>

                    <AddEditConsumptionModal>
                        <Button>{t("app.addConsumption")}</Button>
                    </AddEditConsumptionModal>
                </Flex>
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
