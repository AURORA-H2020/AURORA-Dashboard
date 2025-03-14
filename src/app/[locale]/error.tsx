"use client";

import { PageLayout } from "@/components/pageLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { ReactNode, useEffect } from "react";

type Props = {
  error: Error;
  reset(): void;
};

/**
 * Renders an error page with the given error message and a button to reset.
 *
 * @param {Props} error - The error object to be displayed.
 * @param {Function} reset - The function to be called when the reset button is clicked.
 * @return {ReactNode} The JSX element representing the error page.
 */
const ErrorPage = ({ error, reset }: Props): ReactNode => {
  const t = useTranslations();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageLayout title={t("error.title")}>
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-3xl font-bold">{t("error.title")}</h1>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="mt-4">{error.message}</p>
        </CardContent>

        <CardFooter>
          <Button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => reset()}
          >
            {t("error.reset")}
          </Button>
        </CardFooter>
      </Card>
    </PageLayout>
  );
};

export default ErrorPage;
