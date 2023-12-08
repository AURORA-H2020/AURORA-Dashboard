"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { AuthContextProvider } from "@/context/AuthContext";
import { Theme } from "@radix-ui/themes";
import { Toaster } from "@/components/ui/toaster";

/**
 * Renders the Providers component.
 *
 * @param {ReactNode} children - The child components to render.
 * @param {ThemeProviderProps} props - The props for the ThemeProvider component.
 * @return {ReactElement} The rendered Providers component.
 */
export function Providers({
    children,
    ...props
}: ThemeProviderProps): React.ReactElement {
    return (
        <Theme>
            <AuthContextProvider>
                <NextThemesProvider {...props}>{children}</NextThemesProvider>
                <Toaster />
            </AuthContextProvider>
        </Theme>
    );
}
