"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ReactElement, useEffect, useState } from "react";

/**
 * Renders a theme toggle button.
 *
 * @return {ReactElement} The theme toggle button.
 */
const ThemeToggle = (): ReactElement => {
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
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
};

export { ThemeToggle };
