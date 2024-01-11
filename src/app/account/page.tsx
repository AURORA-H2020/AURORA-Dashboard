"use client";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import { collection, query, getDocs } from "firebase/firestore";
import firebase_app from "@/firebase/config";
import { getFirestore } from "firebase/firestore";
import { Consumption } from "@/models/extensions";
import ConsumptionPreview from "@/components/app/consumptions/consumptionPreview";
import LoadingSpinner from "@/components/ui/loading";
import { Heading, Text } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import { downloadUserData } from "@/firebase/firestore/downloadUserData";

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
            <Heading>Welcome, {user?.displayName}</Heading>
            <Text>Your UID: {user?.uid}</Text>
            <div>
                <Heading as="h2">Your Consumptions</Heading>
                <Button onClick={() => router.push("/account/settings")}>
                    Settings
                </Button>
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
