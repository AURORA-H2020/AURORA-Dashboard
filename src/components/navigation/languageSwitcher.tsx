"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import i18n, { useTranslation } from "next-export-i18n/index";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { supportedLocales } from "@/lib/constants";

enum LanguageDataStore {
    QUERY = "query",
    LOCAL_STORAGE = "localStorage",
}

type Dictionary = { [key: string]: string | Dictionary };

type I18N = {
    translations: { [language: string]: Dictionary };
    defaultLang: string;
    useBrowserDefault: boolean;
    languageDataStore?: LanguageDataStore;
};

/**
 * Updates the router with the currently selected language
 *
 * @param {string} lang - the selected language
 * @return {JSX.Element} the language switcher component
 */
const LanguageSwitcher = (): JSX.Element => {
    const { t } = useTranslation();

    // necessary for updating the router's query parameter inside the click handler
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const i18nObj = i18n() as I18N;
    const languageDataStore = i18nObj.languageDataStore;
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [searchParams],
    );

    /**
     * Updates the router with the currently selected language
     */
    const handleLanguageChange = (lang) => {
        if (languageDataStore === LanguageDataStore.QUERY) {
            router.push(`${pathname}?${createQueryString("lang", lang)}`);
        }

        if (languageDataStore === LanguageDataStore.LOCAL_STORAGE) {
            window.localStorage.setItem("next-export-i18n-lang", lang);
            const event = new Event("localStorageLangChange");
            document.dispatchEvent(event);
        }
    };

    let lang;

    if (languageDataStore === LanguageDataStore.QUERY) {
        const langParam = searchParams.get("lang");
        if (langParam) {
            lang = langParam;
        }
    } else if (
        languageDataStore === (LanguageDataStore.LOCAL_STORAGE as string)
    ) {
        lang = window.localStorage.getItem("next-export-i18n-lang");
    } else {
        lang = i18nObj.defaultLang;
    }

    return (
        <Select onValueChange={handleLanguageChange} defaultValue={lang}>
            <SelectTrigger className="w-[180px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>
                        {t("navigation.languageSwitcher.selectLanguage")}
                    </SelectLabel>
                    {supportedLocales.map((locale) => (
                        <SelectItem key={locale.code} value={locale.code}>
                            {t(locale.name)}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default LanguageSwitcher;
