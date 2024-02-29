"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utilities";
import { Flex, Text } from "@radix-ui/themes";
import { HelpCircle } from "lucide-react";

/**
 * Renders a list of Consumption components.
 *
 * @param {Object} props - The props object.
 * @param {Consumption[]} props.userConsumptions - The user's consumption data.
 * @return {JSX.Element} The consumption list component.
 */
const ConsumptionPlaceholder = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}): JSX.Element => {
    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle className="text-muted-foreground">
                    <Flex direction="column" gap="4" align="center">
                        <HelpCircle size={50} />
                        <Text size="5">{children}</Text>
                    </Flex>
                </CardTitle>
            </CardHeader>
        </Card>
    );
};

export default ConsumptionPlaceholder;
