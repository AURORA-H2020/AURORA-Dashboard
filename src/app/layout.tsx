import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import NavigationBar from "@/components/navigation/navigationBar";
import Footer from "@/components/footer";
import "@radix-ui/themes/styles.css";
import { cn } from "@/lib/utilities";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AURORA Dashboard",
    description: "Latest AURORA Energy Tracker Data",
};

/**
 * Renders the root layout of the application.
 *
 * @param {Object} props - The props object containing the children component.
 * @param {React.ReactNode} props.children - The children component to be rendered.
 * @return {React.ReactNode} The root layout component.
 */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}): React.ReactNode {
    return (
        <html lang="en">
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
