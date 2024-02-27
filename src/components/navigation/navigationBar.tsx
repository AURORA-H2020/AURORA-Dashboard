"use client";

import { usePathname, useRouter } from "@/navigation";
import Link from "next/link";
import Logo from "./logo";
import ThemeToggle from "./themeToggle";

import { Flex } from "@radix-ui/themes";
import { Menu } from "lucide-react";
import { ReactElement, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

import { useAuthContext } from "@/context/AuthContext";
import { logout } from "@/firebase/auth/logout";
import { useTranslations } from "next-intl";

const MenuItems = ({ items, pathname }) => {
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
                    <Link href={item.path}>{item.title}</Link>
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

    const { user } = useAuthContext();
    const router = useRouter();

    const [state, setState] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.replace("/");
    };

    const menus = [
        { title: t("navigation.menu.dashboard"), path: "/" },
        { title: t("navigation.menu.about"), path: "/about" },
    ];

    const loggedOutMenus = [
        { title: t("navigation.menu.account"), path: "/account" },
    ];
    const loggedInMenus = [
        { title: t("navigation.menu.account"), path: "/account" },
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
