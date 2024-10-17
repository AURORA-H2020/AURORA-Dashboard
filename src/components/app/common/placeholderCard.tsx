"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utilities";
import { Flex, Text } from "@radix-ui/themes";
import { CircleHelpIcon, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

const PlaceholderCard = ({
  children,
  className,
  Icon = CircleHelpIcon,
}: {
  children: ReactNode;
  className?: string;
  Icon?: LucideIcon;
}): ReactNode => {
  const size = 50;

  return (
    <Card className={cn(className, "flex h-full items-center justify-center")}>
      <CardHeader>
        <CardTitle className="text-muted-foreground">
          <Flex direction="column" gap="4" align="center">
            <Icon size={size} />
            <Text size="5">{children}</Text>
          </Flex>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export { PlaceholderCard };
