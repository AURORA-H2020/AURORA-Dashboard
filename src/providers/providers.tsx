"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthContextProvider } from "@/providers/context/authContext";
import { FirebaseDataProvider } from "@/providers/context/firebaseContext";
import { Theme } from "@radix-ui/themes";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ThemeProvider, ThemeProviderProps } from "next-themes";
import { ReactNode } from "react";
import { FirebaseAppCheckProvider } from "./FirebaseAppCheckProvider";

/**
 * Renders the Providers component.
 *
 * @param {ReactNode} children - The child components to render.
 * @param {ThemeProviderProps} props - The props for the ThemeProvider component.
 * @return {ReactNode} The rendered Providers component.
 */
const Providers = ({
  children,
  params: { messages, locale },
  ...props
}: {
  params: { messages: AbstractIntlMessages; locale: string };
} & ThemeProviderProps): ReactNode => {
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
              <ThemeProvider {...props}>
                <TooltipProvider>
                  {children}
                  <Toaster richColors />
                </TooltipProvider>
              </ThemeProvider>
            </Theme>
          </FirebaseDataProvider>
        </AuthContextProvider>
      </FirebaseAppCheckProvider>
    </NextIntlClientProvider>
  );
};

export { Providers };
