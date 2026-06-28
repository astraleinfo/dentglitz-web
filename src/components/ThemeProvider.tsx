"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { api } from "@/lib/api";
import { defaultConfig, darken, type SiteConfig } from "@/config/site.config";

const ConfigContext = createContext<SiteConfig>(defaultConfig);

export const useSiteConfig = () => useContext(ConfigContext);

/** "#1e9b8d" -> "30 155 141" (RGB channels for Tailwind opacity support). */
function hexToChannels(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/**
 * Loads branding/theme from the backend `/config` endpoint and injects the
 * colors as CSS variables so the entire UI re-skins with zero code changes.
 * Falls back to local defaults if the backend is unreachable.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);

  useEffect(() => {
    api
      .getConfig()
      .then((cfg) => {
        // Branding stays from frontend .env — only merge scheduling fields from backend.
        setConfig((prev) => ({
          ...prev,
          ...(cfg.appointmentTypes    && { appointmentTypes:    cfg.appointmentTypes }),
          ...(cfg.slotDurationMinutes && { slotDurationMinutes: cfg.slotDurationMinutes }),
          ...(cfg.workingDays?.length  && { workingDays:         cfg.workingDays }),
          ...(cfg.workingHours        && { workingHours:         cfg.workingHours }),
        }));
      })
      .catch(() => {/* keep frontend defaults */});
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", hexToChannels(config.theme.primary));
    root.style.setProperty(
      "--color-primary-dark",
      hexToChannels(darken(config.theme.primary))
    );
    root.style.setProperty("--color-secondary", hexToChannels(config.theme.secondary));
    root.style.setProperty(
      "--color-secondary-dark",
      hexToChannels(darken(config.theme.secondary))
    );
    root.style.setProperty("--logo-bg-color", config.logoBgColor);
    root.style.setProperty("--booking-panel-from", config.bookingWidget.panelFrom);
    root.style.setProperty("--booking-panel-to", config.bookingWidget.panelTo);
    document.title = `${config.clinicName} — ${config.tagline}`;
  }, [config]);

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}
