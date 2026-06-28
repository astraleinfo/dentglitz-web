"use client";

import { useEffect, useState } from "react";
import { useSiteConfig } from "@/components/ThemeProvider";

export function PageLoader() {
  const cfg = useSiteConfig();
  const [fading, setFading] = useState(false);
  const [gone, setGone]     = useState(false);

  useEffect(() => {
    const dismiss = () => {
      setFading(true);
      setTimeout(() => setGone(true), 500);
    };

    if (document.readyState === "complete") {
      // Already loaded — show briefly then hide
      const t = setTimeout(dismiss, 400);
      return () => clearTimeout(t);
    }

    window.addEventListener("load", dismiss, { once: true });
    // Fallback: hide after 3 s no matter what
    const fallback = setTimeout(dismiss, 3000);
    return () => {
      window.removeEventListener("load", dismiss);
      clearTimeout(fallback);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#071224] transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#1e9b8d]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#2a487e]/15 blur-[100px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[#4DD4C5]/6 blur-[100px]" />

      {/* Particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#4DD4C5]/30"
            style={{
              left: `${12 + i * 11}%`,
              top: `${20 + (i % 4) * 18}%`,
              animation: `particle-float ${4 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
      </div>

      {/* Clinic name */}
      <p
        className="mb-1 text-lg font-extrabold tracking-wide text-white animate-fade-up"
        style={{ fontFamily: "var(--font-heading)", animationDelay: "0.15s" }}
      >
        {cfg.clinicName}
      </p>
      <p
        className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#4DD4C5]/70 animate-fade-up"
        style={{ fontFamily: "var(--font-sans)", animationDelay: "0.25s" }}
      >
        The Complete Dental Care
      </p>

      {/* Progress bar */}
      <div className="relative w-48 overflow-hidden rounded-full">
        <div className="h-[3px] w-full rounded-full bg-white/8" />
        <div className="animate-loader-progress absolute inset-y-0 left-0 h-[3px] rounded-full bg-gradient-to-r from-[#4DD4C5] to-[#1e9b8d]" />
      </div>

      {/* Animated dots */}
      {/* <div className="mt-4 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="animate-loader-dot h-1.5 w-1.5 rounded-full bg-[#4DD4C5]"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div> */}
    </div>
  );
}
