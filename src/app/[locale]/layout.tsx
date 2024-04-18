import Providers from "@/app/[locale]/providers";
import Footer from "@/components/footer";
import NavigationBar from "@/components/navigation/navigationBar";
import { locales } from "@/config";
import { cn } from "@/lib/utilities";
import "@radix-ui/themes/styles.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

type Props = {
    children: React.ReactNode;
    params: { locale: string };
};

/**
 * Generates static parameters based on locales.
 *
 * @return {Array} an array of objects containing the locale
 */
export const generateStaticParams = async () => {
    return locales.map((locale) => ({ locale }));
};

/**
 * Generate metadata based on the provided locale.
 *
 * @param {Omit<Props, "children">} params - Object containing the locale parameter
 * @return {Promise<{ title: string, description: string }>} Object with title and description metadata
 */
export const generateMetadata = async ({
    params: { locale },
}: Omit<Props, "children">): Promise<{
    title: string;
    description: string;
}> => {
    const t = await getTranslations({ locale });

    return {
        title: t("metadata.title"),
        description: t("metadata.description"),
    };
};

/**
 * RootLayout function to render the entire layout.
 *
 * @param {Props} children - the child components to be rendered
 * @param {string} locale - the locale parameter
 * @return {React.ReactNode} the rendered HTML layout
 */
const RootLayout = async ({
    children,
    params: { locale },
}: Props): Promise<React.ReactNode> => {
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
                <meta name="theme-color" content="#00c566" />
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
                        {children}
                    </main>
                    <footer className="max-w-screen-xl items-center justify-between mx-auto p-4 self-end">
                        <Footer />
                    </footer>
                </Providers>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
};

export default RootLayout;
