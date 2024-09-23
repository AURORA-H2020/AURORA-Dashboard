"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ReactElement, useEffect, useState } from "react";

/**
 * Renders the logo component.
 *
 * @return {ReactElement} The logo component.
 */
const Logo = (): ReactElement => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className="h-10 w-32 mr-3" />;
  }

  return (
    <Image
      src={
        resolvedTheme === "light"
          ? "/logo/AURORA-logo-light.png"
          : "/logo/AURORA-logo-dark.png"
      }
      alt="AURORA Logo"
      height={100}
      width={100}
      className="object-scale-down h-10 w-32 mr-3"
    />
  );
};

export { Logo };
