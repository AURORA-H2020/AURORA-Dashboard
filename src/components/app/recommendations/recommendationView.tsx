"use client";

import { BorderBox } from "@/components/app/common/borderBox";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { deleteDocumentById } from "@/firebase/firestore/delete-document-by-id";
import { setRecommendationReadStatus } from "@/firebase/hooks/recommendations-hooks";
import { cn } from "@/lib/utilities";
import { Recommendation } from "@/models/firestore/recommendation/recommendation";
import { useAuthContext } from "@/providers/context/authContext";
import { Flex, Text } from "@radix-ui/themes";
import {
  CheckCircleIcon,
  CircleDashedIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const RecommendationView = ({
  recommendation,
}: { recommendation: Recommendation }) => {
  const { user } = useAuthContext();
  const t = useTranslations();
  const [isUpdating, setIsUpdating] = useState(false);
  const format = useFormatter();

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

    setIsUpdating(true);
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
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge variant={recommendation.isRead ? "outline" : "default"}>
          {recommendation.isRead
            ? t("app.recommendations.read")
            : t("app.recommendations.unread")}
        </Badge>
        {recommendation.priority && (
          <Badge
            className={cn(
              recommendation.priority === 1 &&
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
              recommendation.priority === 2 &&
                "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
              recommendation.priority === 3 &&
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            )}
          >
            {recommendation.priority === 1
              ? t("app.recommendations.highPriority")
              : recommendation.priority === 2
                ? t("app.recommendations.mediumPriority")
                : t("app.recommendations.lowPriority")}
          </Badge>
        )}
      </div>

      <Separator />

      <div className="prose max-w-none dark:prose-invert">
        <p className="whitespace-pre-wrap">{recommendation.message}</p>
      </div>

      {recommendation.link && (
        <Flex justify="end">
          <Button className="gap-2" variant="outline" asChild>
            <Link href={recommendation.link} target="_blank" rel="noopener">
              {t("app.recommendations.learnMore")}
              <ExternalLinkIcon className="h-4 w-4" />
            </Link>
          </Button>
        </Flex>
      )}

      {recommendation.rationale && (
        <>
          <BorderBox className="bg-muted/50 text-muted-foreground text-sm">
            <div className="flex flex-col gap-2">
              <p className="font-bold">
                {t("app.recommendations.rationaleTitle")}
              </p>
              <Text className="whitespace-pre-wrap">
                {recommendation.rationale}
              </Text>
            </div>
          </BorderBox>
        </>
      )}

      <BorderBox className="text-sm">
        <div className="grid grid-cols-3 gap-2 xs:grid-cols-1">
          <div>
            <p className="font-bold">{t("app.form.createdAt")}</p>
            <p>{format.dateTime(recommendation.createdAt?.toDate())}</p>
          </div>

          {recommendation.updatedAt && (
            <div>
              <p className="font-bold">{t("app.form.updatedAt")}</p>
              <p>{format.dateTime(recommendation.updatedAt?.toDate())}</p>
            </div>
          )}

          {recommendation.notifyAt && (
            <div className="">
              <p className="font-bold">{t("app.recommendations.notifyAt")}</p>
              <p>{format.dateTime(recommendation.notifyAt?.toDate())}</p>
            </div>
          )}
        </div>
      </BorderBox>
      <div className="flex gap-2">
        <Badge variant="outline">ID: {recommendation.id}</Badge>
        <Badge variant="outline">Type: {recommendation.type}</Badge>
      </div>
      <div className="flex gap-2 justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setReadStatus(!recommendation.isRead)}
          disabled={isUpdating}
          className="flex items-center gap-2"
        >
          {recommendation.isRead ? (
            <>
              <CircleDashedIcon className="h-4 w-4" />
              {t("app.recommendations.markAsUnread")}
            </>
          ) : (
            <>
              <CheckCircleIcon className="h-4 w-4" />
              {t("app.recommendations.markAsRead")}
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive"
          onClick={() => setAlertOpen(true)}
        >
          {t("common.delete")}
        </Button>
      </div>

      <AlertDialog open={isAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("app.recommendations.deleteRecommendationDialogTitle")}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <Text>
            {t("app.recommendations.deleteRecommendationDialogDescription")}
          </Text>

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
    </div>
  );
};

export { RecommendationView };
