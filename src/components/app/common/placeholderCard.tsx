"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utilities";
import { Flex, Text } from "@radix-ui/themes";
import { HelpCircle } from "lucide-react";
import { cloneElement, ReactElement, ReactNode } from "react";

const PlaceholderCard = ({
  children,
  className,
  icon = <HelpCircle />,
}: {
  children: ReactNode;
  className?: string;
  icon?: ReactElement;
}): ReactNode => {
  const size = 50;

  return (
    <Card className={cn(className, "flex h-full items-center justify-center")}>
      <CardHeader>
        <CardTitle className="text-muted-foreground">
          <Flex direction="column" gap="4" align="center">
            {cloneElement(icon, { size })}
            <Text size="5">{children}</Text>
          </Flex>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export { PlaceholderCard };
