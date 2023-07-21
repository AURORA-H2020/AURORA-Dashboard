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

export default async function Home() {
    const res = await fetch("http://127.0.0.1:3000/DummyData.json", {
        next: { revalidate: 0 },
    });
    const data = await res.json();

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
                    <FilterIndex localData={data} />
                </div>
            </div>
            <Accordion>
                <AccordionHeader>Accordion 3</AccordionHeader>
                <AccordionBody>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Phasellus tempor lorem non est congue blandit. Praesent non
                    lorem sodales, suscipit est sed, hendrerit dolor.
                </AccordionBody>
            </Accordion>
        </main>
    );
}
