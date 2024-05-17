"use client";

import { externalLinks } from "@/lib/constants/constants";
import { Link } from "@/navigation";
import { Flex } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./navigation/localeSwitcher";
import { Logo } from "./navigation/logo";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";

/**
 * Renders the footer component.
 *
 * @return {React.ReactNode} The rendered footer component.
 */
const Footer = (): React.ReactNode => {
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
                            <Link href={externalLinks.auroraWebsite}>
                                {t("footer.auroraWebsite")}
                            </Link>
                        </Button>
                        <Separator
                            orientation="vertical"
                            className="h-5 hidden md:block"
                        />
                        <Button variant="link">
                            <Link href={externalLinks.iosDownload}>
                                {t("footer.iosApp")}
                            </Link>
                        </Button>
                        <Separator
                            orientation="vertical"
                            className="h-5 hidden md:block"
                        />
                        <Button variant="link">
                            <Link href={externalLinks.androidDownload}>
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

export { Footer };
