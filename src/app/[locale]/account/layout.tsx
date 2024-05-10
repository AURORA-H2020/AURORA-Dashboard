"use client";

import { EnsureInitialRegistration } from "@/components/hoc/ensureInitialRegistration";
import { EnsureLatestConsent } from "@/components/hoc/ensureLatestConsent";
import { ProtectAccount } from "@/components/hoc/protectAccount";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/navigation";
import { Flex } from "@radix-ui/themes";
import { useTranslations } from "next-intl";

/**
 * Renders the AccountLayout component.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The children to be rendered.
 * @return {React.ReactNode} The rendered AccountLayout component.
 */
const AccountSettingsLayout = ({
    children,
}: {
    children: React.ReactNode;
}): React.ReactNode => {
    const t = useTranslations();
    const pathname = usePathname();

    return (
        <ProtectAccount>
            <EnsureInitialRegistration>
                <EnsureLatestConsent>
                    <Flex className="gap-2 justify-center">
                        <Button
                            variant={
                                pathname === "/account" ? "default" : "outline"
                            }
                            asChild
                        >
                            <Link href={"/account"}>
                                {t("navigation.account.home")}
                            </Link>
                        </Button>
                        <Button
                            variant={
                                pathname === "/account/settings"
                                    ? "default"
                                    : "outline"
                            }
                            asChild
                        >
                            <Link href={"/account/settings"}>
                                {t("navigation.account.settings")}
                            </Link>
                        </Button>
                    </Flex>
                    <div>{children}</div>
                </EnsureLatestConsent>
            </EnsureInitialRegistration>
        </ProtectAccount>
    );
};

export default AccountSettingsLayout;
