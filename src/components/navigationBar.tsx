"use client";

import Link from "next/link";
import ThemeToggle from "./themeToggle";
import Logo from "./logo";
import { usePathname } from "next/navigation";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ReactElement, useState } from "react";
import { Menu } from "lucide-react";
import { Flex } from "@radix-ui/themes";

import { logout } from "@/firebase/auth/logout";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { User } from "@/models/firestore/user/user";

const MenuItems = ({ items, pathname }) => {
    return items.map((item, idx) => {
        // Check if the current pathname is exactly "/account" or starts with "/account/".
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

// Then, in your JSX:

/**
 * Renders the navigation bar component.
 *
 * @return {ReactElement} The rendered navigation bar.
 */
export default function NavigationBar(): ReactElement {
    const pathname = usePathname();

    const { user } = useAuthContext() as { user: User };
    const router = useRouter();

    const [state, setState] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    const menus = [
        { title: "Dashboard", path: "/" },
        { title: "About", path: "/about" },
    ];

    const loggedOutMenus = [
        { title: "Sign in", path: "/signin" },
        { title: "Sign up", path: "/signup" },
    ];

    const loggedInMenus = [{ title: "Account", path: "/account" }];

    return (
        <>
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
                                            Logout
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
        </>
    );
}

/**
 * 
  return (
    
  )
 */
