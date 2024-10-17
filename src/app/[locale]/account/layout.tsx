"use client";

import { EnsureInitialRegistration } from "@/components/hoc/ensureInitialRegistration";
import { EnsureLatestConsent } from "@/components/hoc/ensureLatestConsent";
import { ProtectAccount } from "@/components/hoc/protectAccount";
import { Button } from "@/components/ui/button";
import { Flex } from "@radix-ui/themes";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

/**
 * Renders the AccountLayout component.
 *
 * @param {Object} props - The props object.
 * @param {ReactNode} props.children - The children to be rendered.
 * @return {ReactNode} The rendered AccountLayout component.
 */
const AccountSettingsLayout = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <ProtectAccount>
      <EnsureInitialRegistration>
        <EnsureLatestConsent>
          <Flex className="mb-8 justify-center gap-2">
            <Button
              variant={pathname === "/account" ? "default" : "outline"}
              asChild
            >
              <Link href={"/account"}>{t("navigation.account.home")}</Link>
            </Button>
            <Button
              variant={pathname === "/account/pv" ? "default" : "outline"}
              asChild
            >
              <Link href={"/account/pv"}>{t("navigation.account.pvPage")}</Link>
            </Button>
            <Button
              variant={pathname === "/account/settings" ? "default" : "outline"}
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
