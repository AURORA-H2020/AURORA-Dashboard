"use client";

import { EnsureInitialRegistration } from "@/components/hoc/ensureInitialRegistration";
import { EnsureLatestConsent } from "@/components/hoc/ensureLatestConsent";
import { ProtectAccount } from "@/components/hoc/protectAccount";
import { Button } from "@/components/ui/button";
import { usePathname } from "@/navigation";
import { Flex } from "@radix-ui/themes";
import Link from "next/link";

/**
 * Renders the AccountLayout component.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The children to be rendered.
 * @return {React.ReactNode} The rendered AccountLayout component.
 */
const AccountLayout = ({
    children,
}: {
    children: React.ReactNode;
}): React.ReactNode => {
    const pathname = usePathname();

    return (
        <ProtectAccount>
            <EnsureInitialRegistration>
                <EnsureLatestConsent>
                    <Flex className="gap-2 justify-center">
                        <Button
                            variant={
                                pathname === "/account" ? "default" : "outline"
                            }
                            asChild
                        >
                            <Link href={"/account"}>Home</Link>
                        </Button>
                        <Button
                            variant={
                                pathname === "/account/settings"
                                    ? "default"
                                    : "outline"
                            }
                            asChild
                        >
                            <Link href={"/account/settings"}>Settings</Link>
                        </Button>
                    </Flex>
                    <div>{children}</div>
                </EnsureLatestConsent>
            </EnsureInitialRegistration>
        </ProtectAccount>
    );
};

export default AccountLayout;
