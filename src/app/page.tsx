import {
    Card,
    Grid,
    Title,
    Text,
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@tremor/react";
import NavigationBar from "@/components/navigationBar";
import PerformanceBars from "@/components/performanceBars";
import DetailedCard from "@/components/detailedCard";
import FilterIndex from "@/components/detailedFilteredCharts/filterIndex";
import { testTransform } from "@/lib/transformExportData";

export default async function Home() {
    const res = await fetch("http://127.0.0.1:3000/data/DummyData.json", {
        next: { revalidate: 0 },
    });
    const data = await res.json();

    const resUser = await fetch(
        "http://127.0.0.1:3000/data/users-1697715668.json",
        {
            next: { revalidate: 0 },
        },
    );
    const userData = await resUser.json();

    // const stats = getUserData(userData);
    const testData = testTransform(userData);

    return (
        <main>
            <NavigationBar />
            <div className="p-24">
                <Title>Welcome to the AURORA Dashboard!</Title>
                <Text>
                    Here you can find the latest stats about the AURORA mobile
                    app.
                </Text>
                <div className="mt-6">
                    <FilterIndex localData={testData} />
                </div>
            </div>
        </main>
    );
}
