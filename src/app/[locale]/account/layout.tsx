import { ProtectAccount } from "@/components/hoc/protectAccount";
import { Heading, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

type Props = {
    children: React.ReactNode;
    params: { locale: string };
};

/**
 * Renders the AccountLayout component.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The children to be rendered.
 * @return {React.ReactNode} The rendered AccountLayout component.
 */
export default function AccountLayout({
    children,
    params: { locale },
}: Props): React.ReactNode {
    unstable_setRequestLocale(locale);
    const t = useTranslations();

    return (
        <ProtectAccount>
            <Heading>{t("app.account.myAccount")}</Heading>
            <Text>{t("app.account.comingSoon")}</Text>
            <div>{children}</div>
        </ProtectAccount>
    );
}
