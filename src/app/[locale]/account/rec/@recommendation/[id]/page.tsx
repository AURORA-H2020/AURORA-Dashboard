"use client";

import { BorderBox } from "@/components/app/common/borderBox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import {
  setRecommendationReadStatus,
  useRecommendation,
} from "@/firebase/hooks/recommendations-hooks";
import { useAuthContext } from "@/providers/context/authContext";
import { Flex, Grid, Text } from "@radix-ui/themes";
import {
  CheckCircleIcon,
  CircleDashedIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const RecommendationPage = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const t = useTranslations();
  const [isUpdating, setIsUpdating] = useState(false);
  const format = useFormatter();

  const { recommendation, isLoading, error } = useRecommendation(
    user,
    typeof id === "string" ? id : Array.isArray(id) ? id[0] : "",
  );

  if (isLoading) {
    return (
      <Card className="h-full w-full">
        <CardContent className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error || !recommendation) {
    return (
      <Card className="h-full w-full">
        <CardContent className="p-6">
          <Text className="text-destructive">
            {t("error.recommendationNotFound")}
          </Text>
        </CardContent>
      </Card>
    );
  }

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
    <Grid gap="4">
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <Flex justify="between" align="center">
            <CardTitle className="text-2xl font-bold text-primary">
              {recommendation.title}
            </CardTitle>
            <Flex gap="2">
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
            </Flex>
          </Flex>
        </CardHeader>

        <CardContent className="space-y-4">
          <Separator />

          <div className="prose max-w-none dark:prose-invert">
            <Text className="text-lg whitespace-pre-wrap leading-relaxed">
              {recommendation.recommendation}
            </Text>
          </div>

          {recommendation.link && (
            <Flex justify="end">
              <Button className="gap-2" variant="outline" asChild>
                <a
                  href={recommendation.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("app.recommendations.learnMore")}
                  <ExternalLinkIcon className="h-4 w-4" />
                </a>
              </Button>
            </Flex>
          )}

          <Separator />

          <BorderBox>
            <Grid columns="2" gap="4">
              <div>
                <Text as="p" size="1" className="text-muted-foreground">
                  {t("app.form.createdAt")}
                </Text>
                <Text>
                  {format.dateTime(recommendation.createdAt?.toDate())}
                </Text>
              </div>

              {recommendation.updatedAt && (
                <div>
                  <Text as="p" size="1" className="text-muted-foreground">
                    {t("app.form.updatedAt")}
                  </Text>
                  <Text>
                    {format.dateTime(recommendation.updatedAt?.toDate())}
                  </Text>
                </div>
              )}

              {recommendation.notifyAt && (
                <div>
                  <Text as="p" size="1" className="text-muted-foreground">
                    {t("app.recommendations.notifyAt")}
                  </Text>
                  <Text>
                    {format.dateTime(recommendation.notifyAt?.toDate())}
                  </Text>
                </div>
              )}
            </Grid>
          </BorderBox>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default RecommendationPage;
