"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { setRecommendationReadStatus } from "@/firebase/hooks/recommendations-hooks";
import { cn } from "@/lib/utilities";
import { RecommendationWithId } from "@/models/extensions";
import { useAuthContext } from "@/providers/context/authContext";
import { Flex, Text } from "@radix-ui/themes";
import { CheckCircleIcon, CircleDashedIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { toast } from "sonner";
import { RecommendationView } from "./recommendationView";

/**
 * Renders a preview of a recommendation object with interactive
 * elements such as modals for viewing and deleting.
 *
 * @param {RecommendationWithId} recommendation - The recommendation data to display.
 * @return {ReactNode} A JSX element that includes the recommendation
 * card with modals for detailed view and deletion confirmation.
 */
const RecommendationPreview = ({
  recommendation,
}: {
  recommendation: RecommendationWithId;
}): ReactNode => {
  const t = useTranslations();
  const format = useFormatter();
  const pathname = usePathname();
  const { user } = useAuthContext();
  const currentId = pathname.split("/").pop();
  const isActive = currentId === recommendation.id;

  const recommendationTitle = recommendation.title
    ? recommendation.title
    : t("app.recommendations.recommendation");

  const setReadStatus = async (isRead: boolean) => {
    if (!user || !recommendation.id) return;

    try {
      await setRecommendationReadStatus({
        recommendationId: recommendation.id,
        user,
        isRead,
      });
      isRead
        ? toast.success(t("toast.recommendationMarkedAsUnread"))
        : toast.success(t("toast.recommendationMarkedAsRead"));
    } catch (err) {
      toast.error(t("toast.recommendationUpdateError"));
      console.error("Error updating recommendation:", err);
    }
  };

  const createdDate = recommendation.createdAt
    ? format.dateTime(recommendation.createdAt.toDate())
    : "";

  return (
    <>
      <Card
        className={cn(
          "transition-all hover:border-primary/50",
          isActive && "border-primary bg-primary/5",
        )}
      >
        <CardContent className="px-4 py-3">
          <Flex direction="column" gap="2">
            <Flex justify="between" align="center">
              <div className="flex justify-between w-full">
                <Text className="font-medium line-clamp-1">
                  {recommendationTitle}
                </Text>

                {recommendation.isRead ? (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 ml-1 size-6 p-0"
                    onClick={() => setReadStatus(!recommendation.isRead)}
                  >
                    <CheckCircleIcon className="h-3 w-3 mx-auto my-auto" />
                    <span className="sr-only">
                      {t("app.recommendations.read")}
                    </span>
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 ml-1 bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground size-6 p-0"
                    onClick={() => setReadStatus(!recommendation.isRead)}
                  >
                    <CircleDashedIcon className="h-3 w-3 mx-auto my-auto" />
                    <span className="sr-only">
                      {t("app.recommendations.unread")}
                    </span>
                  </Badge>
                )}
              </div>
            </Flex>

            <div className="flex gap-4 w-full justify-between">
              <div className="flex flex-col gap-4">
                <Text className="text-sm text-muted-foreground line-clamp-2">
                  {recommendation.message}
                </Text>

                <Text size="1" className="text-muted-foreground">
                  {createdDate}
                </Text>
              </div>

              <Flex align="center" justify="between">
                <Flex className="gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        {t("common.view")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{recommendationTitle}</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="max-h-[80vh]">
                        <RecommendationView recommendation={recommendation} />
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </Flex>
              </Flex>
            </div>
          </Flex>
        </CardContent>
      </Card>
    </>
  );
};

export { RecommendationPreview };
