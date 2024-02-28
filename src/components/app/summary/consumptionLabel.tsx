import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LabelMapping } from "@/models/constants";
import { Badge, Flex, Grid } from "@radix-ui/themes";
import { Zap } from "lucide-react";

const ConsumptionLabel = ({
    category,
    label,
    value,
    year,
}: {
    category: string;
    label?: LabelMapping;
    value: number;
    year: number;
}) => {
    return (
        <Card>
            <CardHeader>
                <Flex gap="4" align="center">
                    <Zap size={24} />
                    <Grid>
                        <CardDescription className="text-sm">
                            {category}
                        </CardDescription>
                        <CardTitle className="text-md">
                            <Badge
                                className={`bg-[${label?.color ?? "slate"}] hover:bg-[${label?.color ?? "slate"}] text-white`}
                            >
                                {label?.label ?? "N/A"}
                            </Badge>
                        </CardTitle>
                    </Grid>
                </Flex>
            </CardHeader>
            <CardContent>
                <Grid>
                    <div className="text-2xl font-bold">{value}</div>
                    <p className="text-sm text-muted-foreground">{`in ${year}`}</p>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default ConsumptionLabel;
