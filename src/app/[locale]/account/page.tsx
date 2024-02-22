"use client";
import AddEditConsumptionModal from "@/components/app/consumptions/addEdit/addEditConsumptionModal";
import ConsumptionList from "@/components/app/consumptions/consumptionList";
import ConsumptionSummaryChart from "@/components/app/summary/consumptionSummaryChart";
import InitialRegistrationForm from "@/components/app/user/initialRegistrationForm";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading";
import { useAuthContext } from "@/context/AuthContext";
import { fetchUserConsumptions } from "@/lib/firebaseUtils";
import { ConsumptionWithID } from "@/models/extensions";
import { useRouter } from "@/navigation";
import { Flex } from "@radix-ui/themes";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

/**
 * Renders the account page for authenticated users, displaying user details
 * and a list of their consumptions. Redirects to the home page if the user
 * is not authenticated. It fetches user consumption data from Firestore.
 *
 * @return {JSX.Element} The account page component with user information and
 *                       a list of Consumption components.
 */
function AccountPage(): JSX.Element {
    const { user, loading } = useAuthContext() as {
        user: User;
        loading: boolean;
    };
    const router = useRouter();

    const [userConsumptions, setUserConsumptions] = useState<
        ConsumptionWithID[] | null
    >([]);

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace("/");
            return;
        }

        const fetchUC = async () => {
            const userConsumptions = await fetchUserConsumptions(user.uid);
            setUserConsumptions(userConsumptions);
        };

        fetchUC();
    }, [user, router, loading]);

    if (!user && loading) {
        // Render loading indicator until the auth check is complete
        return <LoadingSpinner />;
    }

    // Authenticated user content
    return (
        <>
            <InitialRegistrationForm />
            <ConsumptionSummaryChart />
            {userConsumptions && (
                <ConsumptionList userConsumptions={userConsumptions} />
            )}
            <Flex className="space-x-2">
                <AddEditConsumptionModal>
                    <Button>Add Consumption</Button>
                </AddEditConsumptionModal>
            </Flex>
        </>
    );
}

export default AccountPage;
