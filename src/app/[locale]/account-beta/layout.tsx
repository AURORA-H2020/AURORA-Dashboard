"use client";

import { Button } from "@/components/ui/button";
import { Flex } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "@/navigation";

/**
 * Renders the AccountLayout component.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The children to be rendered.
 * @return {React.ReactNode} The rendered AccountLayout component.
 */
export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}): React.ReactNode {
    const pathname = usePathname();

    return (
        <>
            <Flex className="gap-2 justify-center">
                <Button
                    variant={
                        pathname === "/account-beta" ? "default" : "outline"
                    }
                >
                    <Link href={"/account-beta"}>Home</Link>
                </Button>
                <Button
                    variant={
                        pathname === "/account-beta/settings"
                            ? "default"
                            : "outline"
                    }
                >
                    <Link href={"/account-beta/settings"}>Settings</Link>
                </Button>
            </Flex>
            <div>{children}</div>
        </>
    );
}
