import LoadingSpinner from "@/components/ui/loading";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/context/AuthContext";
import firebase_app from "@/firebase/config";
import { ConsumptionSummary } from "@/models/firestore/consumption-summary/consumption-summary";
import { ConsumptionSummaryLabeledConsumption } from "@/models/firestore/consumption-summary/consumption-summary-labeled-consumption";
import { ConsumptionCategory } from "@/models/firestore/consumption/consumption-category";
import { Card, Title, BarChart, Text } from "@tremor/react";
import { User } from "firebase/auth";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const firestore = getFirestore(firebase_app);

interface CurrentSummary {
    month: number;
    heating: number;
    electricity: number;
    transportation: number;
}

const findCarbonEmissionByCategory = (
    categories: {
        category: ConsumptionCategory;
        carbonEmission: ConsumptionSummaryLabeledConsumption;
        energyExpended: ConsumptionSummaryLabeledConsumption;
    }[],
    categoryToFind: ConsumptionCategory,
): number => {
    const category = categories.find((c) => c.category === categoryToFind);
    return category ? category.carbonEmission.total : 0;
};

const valueFormatter = (number) =>
    Intl.NumberFormat("us").format(number).toString();

export default function ConsumptionSummaryChart() {
    const { user, loading } = useAuthContext() as {
        user: User;
        loading: boolean;
    };
    const router = useRouter();

    const [userConsumptionSummaries, setUserConsumptionSummaries] = useState<
        ConsumptionSummary[]
    >([]);

    const [currentSummary, setCurrentSummary] = useState<CurrentSummary[]>([]);

    const [summaryYear, setSummaryYear] = useState("2022");

    useEffect(() => {
        if (loading || !user) return;

        let isCancelled = false;

        const fetchUserConsumptions = async () => {
            try {
                const userConsumptionsRef = collection(
                    firestore,
                    "users",
                    user.uid,
                    "consumption-summaries",
                );

                const q = query(userConsumptionsRef);
                const querySnapshot = await getDocs(q);
                const fetchedSummaries = querySnapshot.docs.map((doc) => ({
                    ...(doc.data() as ConsumptionSummary),
                    id: doc.id,
                }));

                if (!isCancelled) {
                    setUserConsumptionSummaries(fetchedSummaries);

                    const summaryData = fetchedSummaries.find(
                        (summary) => summary.year === parseInt(summaryYear),
                    );

                    if (summaryData) {
                        const transformedData = summaryData.months.map(
                            (month) => ({
                                month: month.number,
                                heating: findCarbonEmissionByCategory(
                                    month.categories,
                                    "heating",
                                ),
                                electricity: findCarbonEmissionByCategory(
                                    month.categories,
                                    "electricity",
                                ),
                                transportation: findCarbonEmissionByCategory(
                                    month.categories,
                                    "transportation",
                                ),
                            }),
                        );

                        setCurrentSummary(transformedData);
                        console.log(transformedData);
                    }
                }
            } catch (error) {
                console.error("Error fetching user documents: ", error);
            }
        };

        fetchUserConsumptions();

        return () => {
            isCancelled = true;
        };
    }, [user, loading, summaryYear]); // Only rerun the effect if user, loading, or summaryYear changes

    if (!user && loading) {
        // Render loading indicator until the auth check is complete
        return <LoadingSpinner />;
    }

    return (
        <Card>
            <Select value={summaryYear} onValueChange={setSummaryYear}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {userConsumptionSummaries.map((summary) => {
                            return (
                                <SelectItem
                                    value={summary.year.toString()}
                                    key={summary.year}
                                >
                                    {summary.year}
                                </SelectItem>
                            );
                        })}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Title>Ticket Monitoring</Title>
            <Text>Tickets by Status</Text>
            <BarChart
                className="mt-4 h-80"
                data={currentSummary}
                index="Month"
                categories={["heating", "electricity", "transportation"]}
                colors={["red", "yellow", "blue"]}
                valueFormatter={valueFormatter}
                stack={true}
            />
        </Card>
    );
}
