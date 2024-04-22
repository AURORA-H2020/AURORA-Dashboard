"use client";

import Error from "next/error";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Render the default Next.js 404 page when a route
// is requested that doesn't match the middleware and
// therefore doesn't have a locale associated with it.

/**
 * A function component for rendering the default Next.js 404 page with a redirect timer.
 *
 * @return {React.ReactElement} The JSX element representing the 404 page.
 */
const NotFound = (): React.ReactElement => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace("/");
        }, 3000);

        // Cleanup the timeout to prevent memory leaks if the component unmounts before the timer executes
        return () => clearTimeout(timer);
    });

    return (
        <html lang="en">
            <body>
                <Error
                    statusCode={404}
                    title="Page not found. Redirecting to dashboard."
                />
            </body>
        </html>
    );
};

export { NotFound };
