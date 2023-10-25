"use client";

import { Card } from "@tremor/react";
import Link from "next/link";
import Logo from "./logo";

export default function Footer() {
    return (
        <footer className="bg-white rounded-lg shadow dark:bg-gray-900">
            <Card className="w-full max-w-screen-xl mx-auto md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link href="/" className="flex items-center mb-4 sm:mb-0">
                        <Logo />
                    </Link>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        <li>
                            <Link
                                href="/about"
                                className="mr-4 hover:underline md:mr-6 "
                            >
                                About
                            </Link>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400 flex justify-center">
                    <span className="max-w-md">
                        This project has received funding from the European
                        Union’s Horizon 2020 research and innovation programme
                        under grant agreement No. 101036418.
                    </span>
                </span>
            </Card>
        </footer>
    );
}
