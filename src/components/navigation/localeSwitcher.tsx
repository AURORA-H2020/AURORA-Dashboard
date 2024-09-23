"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supportedLocales } from "@/lib/constants/constants";
import { usePathname, useRouter } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ReactElement, useTransition } from "react";

/**
 * Renders a locale switcher component that allows the user to select a different locale.
 *
 * @return {ReactElement} The rendered locale switcher component.
 */
const LocaleSwitcher = (): ReactElement => {
  const t = useTranslations();
  const locale = useLocale();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  function onSelectChange(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <Select value={locale} onValueChange={onSelectChange} disabled={isPending}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("common.placeholder.selectLanguage")} />
      </SelectTrigger>
      <SelectContent>
        {supportedLocales.map((locale) => (
          <SelectItem key={locale.code} value={locale.code}>
            {t(locale.name)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { LocaleSwitcher };
