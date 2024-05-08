"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utilities";
import { Flex, Text } from "@radix-ui/themes";
import { HelpCircle } from "lucide-react";
import React from "react";

const PlaceholderCard = ({
    children,
    className,
    icon = <HelpCircle />,
}: {
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactElement;
}): React.ReactNode => {
    const size = 50;

    return (
        <Card
            className={cn(className, "flex items-center justify-center h-full")}
        >
            <CardHeader>
                <CardTitle className="text-muted-foreground">
                    <Flex direction="column" gap="4" align="center">
                        {React.cloneElement(icon, { size })}
                        <Text size="5">{children}</Text>
                    </Flex>
                </CardTitle>
            </CardHeader>
        </Card>
    );
};

export { PlaceholderCard };
