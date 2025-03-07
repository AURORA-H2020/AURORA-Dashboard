import { ReactNode } from "react";

export default function Layout({
  sidebar,
  recommendation,
}: {
  sidebar: ReactNode;
  recommendation: ReactNode;
}) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div>{sidebar}</div>
      <div className="col-span-3">{recommendation}</div>
    </div>
  );
}
