"use client";

import { ProtectAccount } from "@/components/hoc/protectAccount";
import { Heading, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";

/**
 * Renders the AccountLayout component.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The children to be rendered.
 * @return {React.ReactNode} The rendered AccountLayout component.
 */
export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}): React.ReactNode {
    const t = useTranslations();

    return (
        <ProtectAccount>
            <Heading>{t("app.account.myAccount")}</Heading>
            <Text>{t("app.account.comingSoon")}</Text>
            <div>{children}</div>
        </ProtectAccount>
    );
}
