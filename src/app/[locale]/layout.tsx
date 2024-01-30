import { Inter } from "next/font/google";
import { Providers } from "./providers";
import NavigationBar from "@/components/navigation/navigationBar";
import Footer from "@/components/footer";
import "@radix-ui/themes/styles.css";
import { cn } from "@/lib/utilities";
import { Analytics } from "@vercel/analytics/react";

import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { locales } from "../../config";
import { ReactNode } from "react";
import { notFound } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

type Props = {
    children: ReactNode;
    params: { locale: string };
};

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params: { locale },
}: Omit<Props, "children">) {
    const t = await getTranslations({ locale });

    return {
        title: t("metadata.title"),
        description: t("metadata.description"),
    };
}

export default async function RootLayout({
    children,
    params: { locale },
}: Props) {
    unstable_setRequestLocale(locale);

    let messages;
    try {
        messages = (await import(`../../../messages/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }

    return (
        <html lang={locale}>
            <head>
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link rel="manifest" href="/site.webmanifest" />
                <link
                    rel="mask-icon"
                    href="/safari-pinned-tab.svg"
                    color="#5bbad5"
                />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
            </head>
            <body className={cn(inter.className, "")}>
                <Providers
                    params={{ messages, locale }}
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <header className="max-w-screen-xl items-center justify-between mx-auto p-4">
                        <NavigationBar />
                    </header>
                    <main className="max-w-screen-xl items-center justify-between mx-auto p-4">
                        <div>{children}</div>
                    </main>
                    <footer className="max-w-screen-xl items-center justify-between mx-auto p-4 self-end">
                        <Footer />
                    </footer>
                </Providers>
                <Analytics />
            </body>
        </html>
    );
}