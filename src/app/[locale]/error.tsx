"use client";

import PageLayout from "@/components/pageLayout";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

type Props = {
    error: Error;
    reset(): void;
};

/**
 * Renders an error page with the given error and reset function.
 *
 * @param {Props} error - the error object
 * @param {Props} reset - the function to reset the error state
 * @return {JSX.Element} the error page component
 */
export default function Error({ error, reset }: Props) {
    const t = useTranslations();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <PageLayout title={t("error.title")}>
            <div>
                {/**  t("error.description") */}
                {t.rich("error.description", {
                    p: (chunks) => <p className="mt-4">{chunks}</p>,
                    retry: (chunks) => (
                        <button
                            className="text-white underline underline-offset-2"
                            onClick={reset}
                            type="button"
                        >
                            {chunks}
                        </button>
                    ),
                })}
            </div>
        </PageLayout>
    );
}
