"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

/**
 * Renders the logo component.
 *
 * @return {JSX.Element} The logo component.
 */
export default function Logo() {
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Image
                src={"/logo/AURORA-logo-light.png"}
                alt="Picture of the author"
                height={100}
                width={100}
                className="object-scale-down h-8 w-30 mr-3"
            />
        );
    }

    return (
        <Image
            src={
                theme === "light"
                    ? "/logo/AURORA-logo-light.png"
                    : "/logo/AURORA-logo-dark.png"
            }
            alt="Picture of the author"
            height={100}
            width={100}
            className="object-scale-down h-8 w-30 mr-3"
        />
    );
}
