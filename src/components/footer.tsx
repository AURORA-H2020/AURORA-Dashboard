"use client";

import Link from "next/link";
import Logo from "./navigation/logo";

import { useTranslations } from "next-intl";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import LocaleSwitcher from "./navigation/localeSwitcher";

/**
 * Renders the footer component.
 *
 * @return {JSX.Element} The rendered footer component.
 */
export default function Footer(): JSX.Element {
    const t = useTranslations();
    return (
        <Card className="items-center p-4 mx-auto md:px-8">
            <div className="sm:flex sm:items-center sm:justify-between">
                <Link href="/" className="flex items-center mb-4 sm:mb-0">
                    <Logo />
                </Link>

                <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                    <li>
                        <Link
                            href="https://aurora-h2020.eu"
                            className="mr-4 hover:underline md:mr-6 "
                        >
                            {t("footer.auroraWebsite")}
                        </Link>
                    </li>
                </ul>
                <LocaleSwitcher />
            </div>
            <Separator className="my-6" />
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400 flex justify-center">
                <span className="max-w-md">{t("footer.fundingNotice")}</span>
            </span>
        </Card>
    );
}
