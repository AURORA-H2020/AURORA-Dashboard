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

const firestore = getFirestore(firebase_app);

function Page(): JSX.Element {
    const { user } = useAuthContext() as { user: User };
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [userConsumptions, setUserConsumptions] = useState<Consumption[]>([]);

    useEffect(() => {
        if (user === null) {
            router.replace("/");
        } else {
            setIsAuthenticated(true);
        }

        // Define an async function to fetch the data within useEffect
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
    }, [user, router]);

    if (!isAuthenticated) {
        // Render nothing or a loading indicator until the auth check is complete
        return <>Loading...</>; // or <div>Loading...</div>
    }

    // Authenticated user content
    return (
        <>
            <h1>Only logged-in users can view this page</h1>
            <p>Welcome, {user.displayName}</p>
            <p>This is the account page</p>
            <p>Your UID: {user.uid}</p>
            <div>
                <h1>User Documents</h1>
                {userConsumptions.map((consumption) => (
                    <div className="mb-4" key={consumption.id}>
                        <ConsumptionPreview consumption={consumption} />
                    </div>
                ))}
            </div>
        </>
    );
}

export default Page;
