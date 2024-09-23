import { PageLayout } from "@/components/pageLayout";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

// Note that `app/[locale]/[...rest]/page.tsx`
// is necessary for this page to render.

/**
 * Renders the NotFoundPage component.
 *
 * @return {ReactNode} The rendered NotFoundPage component.
 */
const NotFoundPage = (): ReactNode => {
  const t = useTranslations();

  return (
    <PageLayout title={t("error.notFound.title")}>
      <p className="max-w-[460px]">{t("error.notFound.description")}</p>
    </PageLayout>
  );
};

export default NotFoundPage;
