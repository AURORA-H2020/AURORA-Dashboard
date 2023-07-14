import { Card, Grid, Title, Text } from "@tremor/react";
import LineChartTabs from "@/components/timeLineChart";
import NavigationBar from "@/components/navigationBar";
import PerformanceBars from "@/components/performanceBars";
import DetailedCard from "@/components/detailedCard";

export default function Home() {
    return (
        <main>
            <NavigationBar />
            <div className="p-24">
                <Title>Welcome to the AURORA Dashboard!</Title>
                <Text>
                    Here you can find the latest stats about the AURORA mobile
                    app.
                </Text>
                <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
                    <Card>
                        <DetailedCard />
                    </Card>
                    <Card>
                        <DetailedCard />
                    </Card>
                    <Card>
                        <DetailedCard />
                    </Card>
                </Grid>
                <div className="mt-6">
                    <Card>
                        <LineChartTabs />
                    </Card>
                </div>
                <div className="mt-6">
                    <Card>
                        <PerformanceBars />
                    </Card>
                </div>
            </div>
        </main>
    );
}
