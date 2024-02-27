"use client";

import AddEditConsumptionModal from "@/components/app/consumptions/addEdit/addEditConsumptionModal";
import ConsumptionList from "@/components/app/consumptions/consumptionList";
import ConsumptionSummaryChart from "@/components/app/summary/consumptionSummaryChart";
import InitialRegistrationModal from "@/components/app/user/initialRegistrationModal";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading";
import { useAuthContext } from "@/context/AuthContext";
import { useFirebaseData } from "@/context/FirebaseContext";
import { Flex } from "@radix-ui/themes";
import { User } from "firebase/auth";

/**
 * Renders the account page for authenticated users, displaying user details
 * and a list of their consumptions. Redirects to the home page if the user
 * is not authenticated. It fetches user consumption data from Firestore.
 *
 * @return {JSX.Element} The account page component with user information and
 *                       a list of Consumption components.
 */
function AccountPage(): JSX.Element {
    const { user, loading } = useAuthContext();
    const { userData, isLoadingUserData } = useFirebaseData();

    if (!user && loading) {
        // Render loading indicator until the auth check is complete
        return <LoadingSpinner />;
    }

    if (isLoadingUserData) {
        // Render loading indicator while user data is being loaded
        return <LoadingSpinner />;
    }

    if (
        !userData?.hasOwnProperty("country") ||
        userData?.country === undefined
    ) {
        return <InitialRegistrationModal />;
    }

    // Authenticated user content
    return (
        <>
            <ConsumptionSummaryChart />
            <ConsumptionList />
            <Flex className="space-x-2">
                <AddEditConsumptionModal>
                    <Button>Add Consumption</Button>
                </AddEditConsumptionModal>
            </Flex>
        </>
    );
}

export default AccountPage;
