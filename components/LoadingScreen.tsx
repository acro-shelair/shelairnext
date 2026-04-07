"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import shelairLogo from "@/assets/shelair-logo-web.png";
import { useLoading } from "@/lib/loading-context";

export default function LoadingScreen() {
  const { isReady } = useLoading();

  // Only render on the client — prevents any server/client tree mismatch
  const [mounted,  setMounted]  = useState(false);
  const [visible,  setVisible]  = useState(true);
  const [fading,   setFading]   = useState(false);
  const [barWidth, setBarWidth] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animate bar to 70% shortly after mount
  useEffect(() => {
    if (!mounted || hasStarted.current) return;
    hasStarted.current = true;
    const t = setTimeout(() => setBarWidth(70), 60);
    return () => clearTimeout(t);
  }, [mounted]);

  // When data is ready: fill bar → fade → remove
  useEffect(() => {
    if (!isReady) return;
    setBarWidth(100);
    const fadeTimer   = setTimeout(() => setFading(true),    300);
    const removeTimer = setTimeout(() => setVisible(false),  850);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, [isReady]);

  // Server render and initial client render both return null — no tree mismatch
  if (!mounted || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-zinc-950 select-none"
      style={{
        opacity:        fading ? 0 : 1,
        transition:     fading ? "opacity 0.55s ease-in-out" : "none",
        pointerEvents:  fading ? "none" : "all",
      }}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full bg-primary/30 blur-2xl scale-125"
            style={{ animation: "pulse 2.2s ease-in-out infinite" }}
          />
          <Image
            src={shelairLogo}
            alt="Shelair"
            width={96}
            height={96}
            className="rounded-full relative z-10 shadow-2xl"
            style={{ animation: "ls-scale 2.2s ease-in-out infinite" }}
            priority
          />
        </div>

        {/* Brand */}
        <div className="text-center space-y-1.5">
          <h1 className="text-white font-extrabold text-2xl tracking-tight">
            Shelair
          </h1>
          <p className="text-zinc-500 text-sm">Commercial Air Conditioning Experts</p>
        </div>

        {/* Progress bar */}
        <div className="w-52 h-[3px] bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{
              width:      `${barWidth}%`,
              transition: barWidth === 100
                ? "width 0.25s linear"
                : "width 1.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>

        {/* Dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-zinc-600"
              style={{ animation: `ls-dot 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>

      {/* Keyframes — scoped name to avoid conflicts */}
      <style>{`
        @keyframes ls-scale {
          0%,100%{transform:scale(1)}
          50%{transform:scale(1.04)}
        }
        @keyframes ls-dot {
          0%,100%{opacity:.3}
          50%{opacity:1}
        }
      `}</style>
    </div>
  );
}
