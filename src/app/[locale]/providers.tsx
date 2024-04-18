"use client";

import { Toaster } from "@/components/ui/sonner";
import { AuthContextProvider } from "@/context/AuthContext";
import { FirebaseDataProvider } from "@/context/FirebaseContext";
import { FirebaseAppCheckProvider } from "@/providers/FirebaseAppCheckProvider";
import { Theme } from "@radix-ui/themes";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

/**
 * Renders the Providers component.
 *
 * @param {React.ReactNode} children - The child components to render.
 * @param {ThemeProviderProps} props - The props for the ThemeProvider component.
 * @return {React.ReactNode} The rendered Providers component.
 */
const Providers = ({
    children,
    params: { messages, locale },
    ...props
}: {
    params: { messages: AbstractIntlMessages; locale: string };
} & ThemeProviderProps): React.ReactNode => {
    return (
        <NextIntlClientProvider
            locale={locale}
            messages={messages}
            timeZone="Europe/Berlin"
        >
            <FirebaseAppCheckProvider>
                <AuthContextProvider>
                    <FirebaseDataProvider>
                        <Theme>
                            <NextThemesProvider {...props}>
                                {children}
                                <Toaster richColors />
                            </NextThemesProvider>
                        </Theme>
                    </FirebaseDataProvider>
                </AuthContextProvider>
            </FirebaseAppCheckProvider>
        </NextIntlClientProvider>
    );
};

export default Providers;
