import { useLocale, useTranslations } from "next-intl";

import { useTransition } from "react";

import { useRouter, usePathname } from "@/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { supportedLocales } from "@/lib/constants";

export default function LocaleSwitcher() {
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
        <Select
            value={locale}
            onValueChange={onSelectChange}
            disabled={isPending}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
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
}
