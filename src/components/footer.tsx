"use client";

import { Link } from "@/i18n/routing";
import { footerLinks } from "@/lib/menus";
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
          >
            {footerLinks.map((item, index) => (
              <Button key={index} variant="link">
                <Link target="_blank" rel="noopener" href={item.path}>
                  {t(item.title)}
                </Link>
              </Button>
            ))}
          </Flex>

          <LocaleSwitcher />
        </Flex>
        <Separator className="my-6" />
        <span className="flex justify-center text-center text-sm text-muted-foreground">
          <span className="max-w-md">{t("footer.fundingNotice")}</span>
        </span>
      </CardContent>
    </Card>
  );
};

export { Footer };
