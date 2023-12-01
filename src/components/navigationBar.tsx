"use client";

import Link from "next/link";
import ThemeToggle from "./themeToggle";
import { Button, Card } from "@tremor/react";
import { DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import Logo from "./logo";
import { usePathname } from "next/navigation";

/**
 * Renders the navigation bar component.
 *
 * @return {ReactElement} The rendered navigation bar.
 */
export default function NavigationBar() {
    const pathname = usePathname();
    const navActive =
        "block py-2 pl-3 pr-4 text-white rounded md:bg-transparent md:p-0 bg-blue-700 md:text-blue-700 md:dark:text-blue-500";
    const navInactive =
        "block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700";

    return (
        <nav>
            <Card className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/">
                    <Logo />
                </Link>
                <div className="flex md:order-2">
                    <Link href={"https://aurora-h2020.eu/ourapp"}>
                        <Button
                            size="md"
                            color="emerald"
                            icon={DevicePhoneMobileIcon}
                            className="mr-2"
                        >
                            Download App
                        </Button>
                    </Link>
                    <ThemeToggle />
                    <button
                        data-collapse-toggle="navbar-cta"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-cta"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 17 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
                    </button>
                </div>
                <div
                    className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                    id="navbar-cta"
                >
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-900  dark:border-gray-700">
                        <li>
                            <Link
                                href="/"
                                className={
                                    pathname === "/" ? navActive : navInactive
                                }
                                aria-current="page"
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/about"
                                className={
                                    pathname === "/about"
                                        ? navActive
                                        : navInactive
                                }
                            >
                                About
                            </Link>
                        </li>
                    </ul>
                </div>
            </Card>
        </nav>
    );
}
