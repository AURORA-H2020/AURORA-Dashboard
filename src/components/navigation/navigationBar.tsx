"use client";

import Link from "next/link";
import ThemeToggle from "./themeToggle";
import Logo from "./logo";
import { usePathname } from "next/navigation";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ReactElement, useState } from "react";
import { Menu } from "lucide-react";
import { Flex } from "@radix-ui/themes";

import { logout } from "@/firebase/auth/logout";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { User } from "@/models/firestore/user/user";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./localeSwitcher";

const MenuItems = ({ items, pathname }) => {
    const t = useTranslations();

    return items.map((item, idx) => {
        // Check if the current pathname is active.
        const isActive =
            pathname === item.path || pathname.startsWith(`${item.path}/`);

        return (
            <li key={idx}>
                <Button
                    className="w-full"
                    variant={isActive ? "default" : "outline"}
                >
                    <Link href={item.path}>{t(item.title)}</Link>
                </Button>
            </li>
        );
    });
};

/**
 * Renders the navigation bar component.
 *
 * @return {ReactElement} The rendered navigation bar component
 */
export default function NavigationBar(): ReactElement {
    const t = useTranslations();

    const pathname = usePathname();

    const { user } = useAuthContext() as { user: User };
    const router = useRouter();

    const [state, setState] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    // t("navigation.menu.dashboard")
    // t("navigation.menu.about")
    const menus = [
        { title: "navigation.menu.dashboard", path: "/" },
        { title: "navigation.menu.about", path: "/about" },
    ];

    // t("navigation.menu.account")
    const loggedOutMenus = [
        { title: "navigation.menu.account", path: "/signin" },
    ];
    const loggedInMenus = [
        { title: "navigation.menu.account", path: "/account" },
    ];

    return (
        <nav className="w-full">
            <Card className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
                <div className="flex items-center justify-between py-3 md:py-5 md:block">
                    <Flex direction={"row"} className="items-center">
                        <Link href="/">
                            <Logo />
                        </Link>
                        <ThemeToggle />
                        <LocaleSwitcher />
                    </Flex>

                    <div className="md:hidden">
                        <Button
                            variant={state ? "secondary" : "outline"}
                            className="p-2"
                            onClick={() => setState(!state)}
                        >
                            <Menu />
                        </Button>
                    </div>
                </div>

                <div
                    className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                        state ? "block" : "hidden"
                    }`}
                >
                    <ul className="justify-end items-center space-y-2 md:flex md:space-x-6 md:space-y-0">
                        <MenuItems items={menus} pathname={pathname} />
                        {user ? (
                            <>
                                <MenuItems
                                    items={loggedInMenus}
                                    pathname={pathname}
                                />
                                <li>
                                    <Button
                                        variant={"secondary"}
                                        className="w-full"
                                        onClick={handleLogout}
                                    >
                                        {t("navigation.menu.logout")}
                                    </Button>
                                </li>
                            </>
                        ) : (
                            <MenuItems
                                items={loggedOutMenus}
                                pathname={pathname}
                            />
                        )}
                    </ul>
                </div>
            </Card>
        </nav>
    );
}
