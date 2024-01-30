import { useLocale, useTranslations } from "next-intl";

import { useTransition } from "react";

import { supportedLocales } from "@/lib/constants";
import { usePathname, useRouter } from "@/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

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
