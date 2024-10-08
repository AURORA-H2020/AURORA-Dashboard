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
import { useAuthContext } from "@/context/AuthContext";
import { logout } from "@/firebase/auth/logout";
import { useUserRoles } from "@/firebase/firebaseHooks";
import { Link, usePathname } from "@/navigation";
import { CircleUser, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

/**
 * Renders the navigation bar component.
 *
 * @return {ReactElement} The rendered navigation bar component
 */
const NavigationBar = (): React.ReactElement => {
    const t = useTranslations();

    const pathname = usePathname();

    const { user } = useAuthContext();
    const { isAdmin } = useUserRoles(user?.uid);

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

    const menuItems = [
        { title: t("navigation.menu.dashboard"), path: "/" },
        { title: t("navigation.menu.about"), path: "/about" },
        { title: t("navigation.menu.account"), path: "/account" },
    ];

    const loggedInMenus = [
        { title: t("navigation.menu.account"), path: "/account" },
        { title: t("navigation.account.settings"), path: "/account/settings" },
    ];

    const adminMenus = [{ title: t("navigation.menu.admin"), path: "/admin" }];

    return (
        <Card className="flex items-center gap-4 p-4 md:px-8">
            <nav className="hidden w-full flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-md lg:gap-6">
                <Link href="/" className="w-max">
                    <Logo />
                </Link>
                {menuItems.map((item, idx) => {
                    // Check if the current pathname is active.
                    const isActive =
                        pathname === item.path ||
                        pathname.startsWith(`${item.path}/`);

                    return (
                        <Link
                            key={`${idx}`}
                            href={item.path}
                            className={`${isActive ? "text-foreground" : "text-muted-foreground"} transition-colors hover:text-foreground`}
                        >
                            {item.title}
                        </Link>
                    );
                })}
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
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
                        {menuItems.map((item, idx) => {
                            // Check if the current pathname is active.
                            const isActive =
                                pathname === item.path ||
                                pathname.startsWith(`${item.path}/`);

                            return (
                                <SheetClose key={`${idx}`} asChild>
                                    <Link
                                        href={item.path}
                                        className={`${isActive ? "text-foreground" : "text-muted-foreground"} transition-colors hover:text-foreground`}
                                    >
                                        {item.title}
                                    </Link>
                                </SheetClose>
                            );
                        })}
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex w-full justify-end items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <ThemeToggle />
                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full"
                            >
                                <CircleUser className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {loggedInMenus.map((menu, idx) => (
                                <Link href={menu.path} key={`${idx}`}>
                                    <DropdownMenuItem>
                                        {menu.title}
                                    </DropdownMenuItem>
                                </Link>
                            ))}
                            {isAdmin && (
                                <>
                                    <DropdownMenuSeparator />
                                    {adminMenus.map((menu, idx) => (
                                        <Link href={menu.path} key={`${idx}`}>
                                            <DropdownMenuItem>
                                                {menu.title}
                                            </DropdownMenuItem>
                                        </Link>
                                    ))}
                                </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                {t("navigation.menu.logout")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </Card>
    );
};

export { NavigationBar };
