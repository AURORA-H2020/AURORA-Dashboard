import PageLayout from "@/components/pageLayout";
import { useTranslations } from "next-intl";

// Note that `app/[locale]/[...rest]/page.tsx`
// is necessary for this page to render.

export default function NotFoundPage() {
    const t = useTranslations();

    return (
        <PageLayout title={t("error.notFound.title")}>
            <p className="max-w-[460px]">{t("error.notFound.description")}</p>
        </PageLayout>
    );
}
