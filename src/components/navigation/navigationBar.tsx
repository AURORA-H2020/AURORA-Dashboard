"use client";

import { useAuthContext } from "@/context/AuthContext";
import { logout } from "@/firebase/auth/logout";
import { Link, usePathname, useRouter } from "@/navigation";
import { CircleUser, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import Logo from "./logo";
import ThemeToggle from "./themeToggle";
import { useUserRoles } from "@/firebase/firebaseHooks";

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
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace("/");
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
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
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
                            key={idx}
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
                                <SheetClose key={idx} asChild>
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
                                <Link href={menu.path} key={idx}>
                                    <DropdownMenuItem>
                                        {menu.title}
                                    </DropdownMenuItem>
                                </Link>
                            ))}
                            {isAdmin && (
                                <>
                                    <DropdownMenuSeparator />
                                    {adminMenus.map((menu, idx) => (
                                        <Link href={menu.path} key={idx}>
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

export default NavigationBar;
