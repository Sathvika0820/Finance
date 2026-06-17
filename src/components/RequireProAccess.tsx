import type { ReactNode } from "react";

export function RequireProAccess({
  children,
}: {
  children: ReactNode;
  description?: string;
  title?: string;
}) {
  return <>{children}</>;
}
