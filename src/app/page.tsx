import { Title, Text } from "@tremor/react";
import NavigationBar from "@/components/navigationBar";
import FilterIndex from "@/components/detailedFilteredCharts/filterIndex";
import { testTransform } from "@/lib/transformExportData";
import { promises as fs } from "fs";

export default async function Home() {
    const file = await fs.readFile(
        process.cwd() + "/src/data/users-1697715668.json",
        "utf8",
    );
    const data = JSON.parse(file);

    /*
    const res = await fetch(
        "http://127.0.0.1:3000/data/users-1697715668.json",
        {
            next: { revalidate: 0 },
        },
    );
    const userData = await res.json();
    */

    const testData = testTransform(data);

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
