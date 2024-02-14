"use client";
import ConsumptionPreview from "@/components/app/consumptions/consumptionPreview";
import ConsumptionSummaryChart from "@/components/app/summary/consumptionSummaryChart";
import LoadingSpinner from "@/components/ui/loading";
import { useAuthContext } from "@/context/AuthContext";
import { fetchUserConsumptions } from "@/lib/firebaseUtils";
import { Consumption } from "@/models/extensions";
import { useRouter } from "@/navigation";
import { Heading } from "@radix-ui/themes";
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
        Consumption[] | null
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
            <ConsumptionSummaryChart />
            <div>
                <div className="mb-4 mt-8">
                    <Heading weight="bold">Your Consumptions</Heading>
                </div>
                {userConsumptions &&
                    userConsumptions.map((consumption) => (
                    <div className="mb-4" key={consumption.id}>
                        <ConsumptionPreview consumption={consumption} />
                    </div>
                ))}
            </div>
        </>
    );
}

export default AccountPage;
