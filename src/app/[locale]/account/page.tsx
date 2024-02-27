"use client";

import AddEditConsumptionModal from "@/components/app/consumptions/addEdit/addEditConsumptionModal";
import ConsumptionList from "@/components/app/consumptions/consumptionList";
import AddEditRecurringConsumptionModal from "@/components/app/recurringConsumptions/addEdit/addEditRecurringConsumptionModal";
import RecurringConsumptionList from "@/components/app/recurringConsumptions/recurringConsumptionList";
import ConsumptionSummaryChart from "@/components/app/summary/consumptionSummaryChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/context/AuthContext";
import { useFirebaseData } from "@/context/FirebaseContext";
import { Flex, Heading } from "@radix-ui/themes";
import { useTranslations } from "next-intl";

/**
 * Renders the account page for authenticated users, displaying user details
 * and a list of their consumptions. Redirects to the home page if the user
 * is not authenticated. It fetches user consumption data from Firestore.
 *
 * @return {JSX.Element} The account page component with user information and
 *                       a list of Consumption components.
 */
function AccountPage(): JSX.Element {
    const t = useTranslations();

    const { user, loading } = useAuthContext();
    const { isLoadingUserData } = useFirebaseData();

    if (!user && loading) {
        // Render loading indicator until the auth check is complete
        return <LoadingSpinner />;
    }

    if (isLoadingUserData) {
        // Render loading indicator while user data is being loaded
        return <LoadingSpinner />;
    }

    return (
        <>
            <Card className="my-4">
                <CardContent>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <ConsumptionSummaryChart />
                </CardContent>
            </Card>

            <Tabs defaultValue="consumptions" className="mb-4 mt-8">
                <TabsList>
                    <TabsTrigger value="consumptions">Consumptions</TabsTrigger>
                    <TabsTrigger value="recurring-consumptions">
                        Recurring Consumptions
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="consumptions">
                    <Flex
                        justify="between"
                        align={{ initial: "start", xs: "center" }}
                        direction={{ initial: "column", xs: "row" }}
                        className="gap-2"
                    >
                        <Heading weight="bold">
                            {t("app.yourConsumptions")}
                        </Heading>

                        <AddEditConsumptionModal>
                            <Button>{t("app.addConsumption")}</Button>
                        </AddEditConsumptionModal>
                    </Flex>
                    <ConsumptionList className="mt-6" />
                </TabsContent>
                <TabsContent value="recurring-consumptions">
                    <Flex
                        justify="between"
                        align={{ initial: "start", xs: "center" }}
                        direction={{ initial: "column", xs: "row" }}
                        className="gap-2"
                    >
                        <Heading weight="bold">
                            Your Recurring Consumptions
                        </Heading>

                        <AddEditRecurringConsumptionModal>
                            <Button>Add recurring consumption</Button>
                        </AddEditRecurringConsumptionModal>
                    </Flex>
                    <RecurringConsumptionList className="mt-6" />
                </TabsContent>
            </Tabs>
        </>
    );
}

export default AccountPage;
