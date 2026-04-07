"use client";

import { usePathname } from "next/navigation";

export default function PublicShell({
  children,
  navbar,
  footer,
}: {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && navbar}
      <main className={isAdmin ? "flex-1" : "flex-1 pt-16 md:pt-20"}>
        {children}
      </main>
      {!isAdmin && footer}
    </div>
  );
}
