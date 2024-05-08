"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Renders a theme toggle button.
 *
 * @return {React.ReactElement} The theme toggle button.
 */
const ThemeToggle = (): React.ReactElement => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <Skeleton className="h-10 w-10" />;
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
        >
            {resolvedTheme === "light" ? <Moon /> : <Sun />}
        </Button>
    );
};

export { ThemeToggle };
