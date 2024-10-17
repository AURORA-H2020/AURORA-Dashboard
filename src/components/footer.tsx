"use client";

import { externalLinks } from "@/lib/constants/common-constants";
import { Link } from "@/i18n/routing";
import { Flex } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { LocaleSwitcher } from "./navigation/localeSwitcher";
import { Logo } from "./navigation/logo";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";

/**
 * Renders the footer component.
 *
 * @return {ReactNode} The rendered footer component.
 */
const Footer = (): ReactNode => {
  const t = useTranslations();
  return (
    <Card className="items-center">
      <CardContent>
        <Flex
          direction={{ initial: "column", sm: "row" }}
          justify="between"
          align="center"
          className="mt-6 gap-2 gap-x-4"
        >
          <Link href="/" className="mb-4 flex items-center sm:mb-0">
            <Logo />
          </Link>
          <Flex
            direction={{ initial: "column", sm: "row" }}
            justify="between"
            align="center"
            className=""
          >
            <Button variant="link">
              <Link
                target="_blank"
                rel="noopener"
                href={externalLinks.auroraWebsite}
              >
                {t("footer.auroraWebsite")}
              </Link>
            </Button>
            <Separator orientation="vertical" className="hidden h-5 md:block" />
            <Button variant="link">
              <Link
                target="_blank"
                rel="noopener"
                href={externalLinks.iosDownload}
              >
                {t("footer.iosApp")}
              </Link>
            </Button>
            <Separator orientation="vertical" className="hidden h-5 md:block" />
            <Button variant="link">
              <Link
                target="_blank"
                rel="noopener"
                href={externalLinks.androidDownload}
              >
                {t("footer.androidApp")}
              </Link>
            </Button>
          </Flex>

          <LocaleSwitcher />
        </Flex>
        <Separator className="my-6" />
        <span className="flex justify-center text-center text-sm text-gray-500 dark:text-gray-400">
          <span className="max-w-md">{t("footer.fundingNotice")}</span>
        </span>
      </CardContent>
    </Card>
  );
};

export { Footer };
