"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { Theme } from "@radix-ui/themes";
import { AuthContextProvider } from "@/context/AuthContext";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { Toaster } from "@/components/ui/sonner";

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
        <NextIntlClientProvider locale={locale} messages={messages}>
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
