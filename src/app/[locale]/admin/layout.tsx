"use client";

import { ProtectAdmin } from "@/components/hoc/protectAdmin";
import { ReactNode } from "react";

/**
 * Renders the AccountLayout component.
 *
 * @param {Object} props - The props object.
 * @param {ReactNode} props.children - The children to be rendered.
 * @return {ReactNode} The rendered AccountLayout component.
 */
const AccountLayout = ({ children }: { children: ReactNode }): ReactNode => {
  return (
    <ProtectAdmin>
      <div>{children}</div>
    </ProtectAdmin>
  );
};

export default AccountLayout;
