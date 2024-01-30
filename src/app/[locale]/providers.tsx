"use client";

import { Toaster } from "@/components/ui/sonner";
import { AuthContextProvider } from "@/context/AuthContext";
import { Theme } from "@radix-ui/themes";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import * as React from "react";

/**
 * Renders the Providers component.
 *
 * @param {ReactNode} children - The child components to render.
 * @param {ThemeProviderProps} props - The props for the ThemeProvider component.
 * @return {ReactElement} The rendered Providers component.
 */
export function Providers({
    children,
    params: { messages, locale },
    ...props
}: {
    params: { messages: AbstractIntlMessages; locale: string };
} & ThemeProviderProps): React.ReactElement {
    return (
        <NextIntlClientProvider
            locale={locale}
            messages={messages}
            timeZone="Europe/Berlin"
        >
            <AuthContextProvider>
                <Theme>
                    <NextThemesProvider {...props}>
                        {children}
                        <Toaster richColors />
                    </NextThemesProvider>
                </Theme>
            </AuthContextProvider>
        </NextIntlClientProvider>
    );
}