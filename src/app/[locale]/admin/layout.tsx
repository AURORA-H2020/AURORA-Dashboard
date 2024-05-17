"use client";

import { ProtectAdmin } from "@/components/hoc/protectAdmin";

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
    return (
        <ProtectAdmin>
            <div>{children}</div>
        </ProtectAdmin>
    );
};

export default AccountLayout;
