"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteDocumentById } from "@/firebase/firestore/delete-document-by-id";
import { setRecommendationReadStatus } from "@/firebase/hooks/recommendations-hooks";
import { cn } from "@/lib/utilities";
import { RecommendationWithId } from "@/models/extensions";
import { useAuthContext } from "@/providers/context/authContext";
import { Flex, Text } from "@radix-ui/themes";
import { CheckCircleIcon, CircleDashedIcon, Trash2Icon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { toast } from "sonner";

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

  // State to manage the visibility of the delete confirmation
  const [isAlertOpen, setAlertOpen] = useState(false);

  const handleDelete = async () => {
    setAlertOpen(false);

    deleteDocumentById(user, recommendation.id, "recommendations").then(
      (success) => {
        if (success) {
          toast.success(t("toast.deleteRecommendation.success"));
        } else {
          toast.error(t("toast.deleteRecommendation.error"));
        }
      },
    );
  };

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
                  {recommendation.title}
                </Text>

                {recommendation.isRead ? (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 ml-1"
                    onClick={() => setReadStatus(!recommendation.isRead)}
                  >
                    <CheckCircleIcon className="h-3 w-3" />
                    <span className="sr-only">
                      {t("app.recommendations.read")}
                    </span>
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 ml-1 bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
                    onClick={() => setReadStatus(!recommendation.isRead)}
                  >
                    <CircleDashedIcon className="h-3 w-3" />
                    <span className="sr-only">
                      {t("app.recommendations.unread")}
                    </span>
                  </Badge>
                )}
              </div>
            </Flex>

            <Text className="text-sm text-muted-foreground line-clamp-2">
              {recommendation.recommendation}
            </Text>

            <Text size="1" className="text-muted-foreground">
              {createdDate}
            </Text>

            <Flex align="center" justify="between">
              <Flex className="gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => setAlertOpen(true)}
                >
                  <span className="sr-only">{t("common.delete")}</span>
                  <Trash2Icon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7" asChild>
                  <Link href={`/account/rec/${recommendation.id}`}>
                    {t("common.view")}
                  </Link>
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </CardContent>
      </Card>

      <AlertDialog open={isAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("app.recommendations.deleteRecommendationDialogTitle")}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Flex justify="between" className="gap-4">
              <Button
                onClick={() => setAlertOpen(false)}
                variant="outline"
                className="w-full"
              >
                {t("common.cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="w-full"
              >
                {t("common.delete")}
              </Button>
            </Flex>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export { RecommendationPreview };
