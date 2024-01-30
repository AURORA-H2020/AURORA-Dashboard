"use client";
import ConsumptionPreview from "@/components/app/consumptions/consumptionPreview";
import ConsumptionSummaryChart from "@/components/app/summary/consumptionSummaryChart";
import LoadingSpinner from "@/components/ui/loading";
import { useAuthContext } from "@/context/AuthContext";
import firebase_app from "@/firebase/config";
import { Consumption } from "@/models/extensions";
import { Heading } from "@radix-ui/themes";
import { User } from "firebase/auth";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const firestore = getFirestore(firebase_app);

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

    const [userConsumptions, setUserConsumptions] = useState<Consumption[]>([]);

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace("/");
            return;
        }

        // Async function to fetch the data within useEffect
        const fetchUserConsumptions = async () => {
            try {
                // Reference to the collection where user documents are stored
                const userConsumptionsRef = collection(
                    firestore,
                    "users",
                    user.uid,
                    "consumptions",
                );

                // Create a query against the collection, filtering by user ID
                const q = query(userConsumptionsRef);

                // Execute the query
                const querySnapshot = await getDocs(q);

                // Map through the documents and set the state
                const docs: Consumption[] = querySnapshot.docs.map((doc) => ({
                    ...(doc.data() as Consumption),
                    id: doc.id,
                }));
                setUserConsumptions(docs);
            } catch (error) {
                console.error("Error fetching user documents: ", error);
                // Handle any errors, such as showing an error message to the user
            }
        };

        fetchUserConsumptions();
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
                {userConsumptions.map((consumption) => (
                    <div className="mb-4" key={consumption.id}>
                        <ConsumptionPreview consumption={consumption} />
                    </div>
                ))}
            </div>
        </>
    );
}

export default AccountPage;
