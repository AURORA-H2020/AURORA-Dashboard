"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteDocumentById } from "@/firebase/firestore/delete-document-by-id";
import { RecommendationWithId } from "@/models/extensions";
import { useAuthContext } from "@/providers/context/authContext";
import { Flex, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { toast } from "sonner";

/**
 * Renders a preview of a consumption object with interactive
 * elements such as modals for viewing, editing, and deleting.
 *
 * @param {Consumption} consumption - The consumption data to display.
 * @return {ReactNode} A JSX element that includes the consumption
 * card with modals for detailed view and deletion confirmation.
 */
const RecommendationPreview = ({
  recommendation,
}: {
  recommendation: RecommendationWithId;
}): ReactNode => {
  const t = useTranslations();

  const { user } = useAuthContext();

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

  return (
    <>
      <Card>
        <CardContent className="px-6 py-2">
          <Flex justify="between" align="center" className="mb-2">
            <Text className="text-lg">{recommendation.title}</Text>
            <Flex className="gap-2">
              <Button variant="outline" className="text-primary" asChild>
                <Link href={`rec/${recommendation.id}`}>
                  {t("common.view")}
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => setAlertOpen(true)}
                className="text-destructive"
              >
                {t("common.delete")}
              </Button>
            </Flex>
          </Flex>
          <Text className="text-sm text-muted-foreground">
            {recommendation.recommendation}
          </Text>
        </CardContent>
      </Card>

      <AlertDialog open={isAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("app.form.deleteConsumptionDialogTitle")}
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
