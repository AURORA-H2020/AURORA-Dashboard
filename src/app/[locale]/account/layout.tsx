"use client";

import { EnsureInitialRegistration } from "@/components/hoc/ensureInitialRegistration";
import { EnsureLatestConsent } from "@/components/hoc/ensureLatestConsent";
import { ProtectAccount } from "@/components/hoc/protectAccount";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserRoles } from "@/firebase/hooks/user-hooks";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { userMenuLinks } from "@/lib/menus";
import { useAuthContext } from "@/providers/context/authContext";
import { useFirebaseData } from "@/providers/context/firebaseContext";
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
  const router = useRouter();

  const { user } = useAuthContext();
  const { isAdmin } = useUserRoles(user?.uid);
  const { userCityData } = useFirebaseData();

  return (
    <ProtectAccount>
      <EnsureInitialRegistration>
        <EnsureLatestConsent>
          <div className="hidden justify-start gap-2 md:flex">
            {userMenuLinks.map((item, index) => {
              if (item.isAdmin && !isAdmin) return;
              if (
                userCityData &&
                userCityData.hasPhotovoltaics === false &&
                item.path === "/account/pv"
              )
                return;
              return (
                <Button
                  key={index}
                  variant={pathname === item.path ? "default" : "outline"}
                  asChild
                >
                  <Link href={item.path}>{t(item.title)}</Link>
                </Button>
              );
            })}
          </div>
          <div className="flex md:hidden">
            <Select
              onValueChange={(value) => router.push(value)}
              defaultValue={pathname}
              value={pathname}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {userMenuLinks.map((item, index) => {
                  if (item.isAdmin && !isAdmin) return;
                  return (
                    <SelectItem key={index} value={item.path}>
                      {t(item.title)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-8">{children}</div>
        </EnsureLatestConsent>
      </EnsureInitialRegistration>
    </ProtectAccount>
  );
};

export default AccountSettingsLayout;
