"use client";

import { Flex } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import Link from "next/link";
import LocaleSwitcher from "./navigation/localeSwitcher";
import Logo from "./navigation/logo";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";

/**
 * Renders the footer component.
 *
 * @return {JSX.Element} The rendered footer component.
 */
const Footer = (): JSX.Element => {
    const t = useTranslations();
    return (
        <Card className="items-center">
            <CardContent>
                <Flex
                    direction={{ initial: "column", sm: "row" }}
                    justify="between"
                    align="center"
                    className="gap-2 gap-x-4 mt-6"
                >
                    <Link href="/" className="flex items-center mb-4 sm:mb-0">
                        <Logo />
                    </Link>
                    <Flex
                        direction={{ initial: "column", sm: "row" }}
                        justify="between"
                        align="center"
                        className=""
                    >
                        <Button variant="link">
                            <Link href="https://aurora-h2020.eu">
                                {t("footer.auroraWebsite")}
                            </Link>
                        </Button>
                        <Separator
                            orientation="vertical"
                            className="h-5 hidden md:block"
                        />
                        <Button variant="link">
                            <Link href="https://apps.apple.com/us/app/aurora-energy-tracker/id1668801198">
                                {t("footer.iosApp")}
                            </Link>
                        </Button>
                        <Separator
                            orientation="vertical"
                            className="h-5 hidden md:block"
                        />
                        <Button variant="link">
                            <Link href="https://play.google.com/store/apps/details?id=eu.inscico.aurora_app">
                                {t("footer.androidApp")}
                            </Link>
                        </Button>
                    </Flex>

                    <LocaleSwitcher />
                </Flex>
                <Separator className="my-6" />
                <span className="text-sm text-gray-500 text-center dark:text-gray-400 flex justify-center">
                    <span className="max-w-md">
                        {t("footer.fundingNotice")}
                    </span>
                </span>
            </CardContent>
        </Card>
    );
};

export default Footer;
