"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isFirst = useRef(true);
  const isNavigating = useRef(false);

  // Fire immediately on any internal link click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip external, hash-only, mailto, tel, and _blank links
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.target === "_blank"
      )
        return;

      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        // Skip if already on this page (hash nav or same path)
        if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      } catch {
        return;
      }

      // Start the bar immediately
      timers.current.forEach(clearTimeout);
      timers.current = [];
      isNavigating.current = true;

      setWidth(0);
      setVisible(true);
      // Crawl to 70% — gives the illusion of progress while server fetches
      timers.current.push(setTimeout(() => setWidth(70), 20));
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Complete when the pathname actually changes (navigation done)
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    if (!isNavigating.current) return;
    isNavigating.current = false;

    timers.current.forEach(clearTimeout);
    timers.current = [];

    setWidth(100);
    timers.current.push(setTimeout(() => setVisible(false), 400));
    timers.current.push(setTimeout(() => setWidth(0), 450));

    return () => timers.current.forEach(clearTimeout);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[600] h-[3px] pointer-events-none">
      <div
        className="h-full bg-primary"
        style={{
          width: `${width}%`,
          transition:
            width === 100
              ? "width 0.2s ease-out"
              : width === 70
              ? "width 2.5s cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
        }}
      />
    </div>
  );
}
