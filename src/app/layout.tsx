import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import NavigationBar from "@/components/navigationBar";
import Footer from "@/components/footer";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AURORA Dashboard",
    description: "Latest AURORA Energy Tracker Data",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/flowbite@1.5.1/dist/flowbite.min.css"
                />
            </head>
            <body className={inter.className}>
                <Providers attribute="class" defaultTheme="system" enableSystem>
                    <header className="max-w-screen-xl items-center justify-between mx-auto p-4">
                        <NavigationBar />
                    </header>
                    <div className="max-w-screen-xl items-center justify-between mx-auto p-4">
                        <div>{children}</div>
                    </div>
                    <div className="max-w-screen-xl items-center justify-between mx-auto p-4">
                        <Footer />
                    </div>
                </Providers>
                <Script src="https://unpkg.com/flowbite@1.5.1/dist/flowbite.js"></Script>
            </body>
        </html>
    );
}
