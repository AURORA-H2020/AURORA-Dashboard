"use client";

import { PageLayout } from "@/components/pageLayout";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

type Props = {
    error: Error;
    reset(): void;
};

/**
 * Renders an error page with the given error message and a button to reset.
 *
 * @param {Props} error - The error object to be displayed.
 * @param {Function} reset - The function to be called when the reset button is clicked.
 * @return {React.ReactNode} The JSX element representing the error page.
 */
const Error = ({ error, reset }: Props): React.ReactNode => {
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
};

export default Error;
