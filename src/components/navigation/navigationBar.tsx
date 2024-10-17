"use client";

import { Logo } from "@/components/navigation/logo";
import { ThemeToggle } from "@/components/navigation/themeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logout } from "@/firebase/auth/logout";
import { useUserRoles } from "@/firebase/hooks/user-hooks";
import { Link, usePathname } from "@/i18n/routing";
import { navigationLinks, userMenuLinks } from "@/lib/menus";
import { useAuthContext } from "@/providers/context/authContext";
import { useFirebaseData } from "@/providers/context/firebaseContext";
import { CircleUserIcon, MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";
import { toast } from "sonner";

/**
 * Renders the navigation bar component.
 *
 * @return {ReactElement} The rendered navigation bar component
 */
const NavigationBar = (): ReactElement => {
  const t = useTranslations();

  const pathname = usePathname();

  const { user } = useAuthContext();
  const { isAdmin } = useUserRoles(user?.uid);
  const { userCityData } = useFirebaseData();

  /**
   * Logs the user out and redirects them to the home page.
   *
   * @return {Promise<void>} A promise that resolves when the user is logged out and redirected.
   */
  const handleLogout = () => {
    logout().then((success) => {
      if (success) {
        toast.success(t("toast.auth.logout.success"));
      } else {
        toast.error(t("toast.auth.logout.error"));
      }
    });
  };

  return (
    <Card className="flex items-center justify-between gap-4 p-4 md:px-8">
      <nav className="text-md hidden w-full flex-col gap-6 text-lg font-semibold md:flex md:flex-row md:items-center">
        <Link href="/" className="w-max">
          <Logo />
        </Link>
        {navigationLinks.map((item, idx) => {
          const isActive =
            pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={`${idx}`}
              href={item.path}
              className={`${isActive ? "text-foreground" : "text-muted-foreground"} transition-colors hover:text-foreground`}
            >
              {t(item.title)}
            </Link>
          );
        })}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Logo />
            </Link>
            {userMenuLinks.map((item, idx) => {
              const isActive =
                pathname === item.path || pathname.startsWith(`${item.path}/`);

              return (
                <SheetClose key={`${idx}`} asChild>
                  <Link
                    href={item.path}
                    className={`${isActive ? "text-foreground" : "text-muted-foreground"} transition-colors hover:text-foreground`}
                  >
                    {t(item.title)}
                  </Link>
                </SheetClose>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <ThemeToggle />
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUserIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {userMenuLinks.map((item, idx) => {
                if (item.isAdmin && !isAdmin) return;
                if (
                  userCityData &&
                  userCityData.hasPhotovoltaics === false &&
                  item.path === "/account/pv"
                )
                  return;
                return (
                  <Link href={item.path} key={`${idx}`}>
                    <DropdownMenuItem>{t(item.title)}</DropdownMenuItem>
                  </Link>
                );
              })}

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                {t("navigation.menu.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="secondary" size="icon" className="rounded-full">
            <Link href={"/account"}>
              <CircleUserIcon className="h-5 w-5" />
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
};

export { NavigationBar };
