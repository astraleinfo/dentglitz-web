import type { Config } from "tailwindcss";

/**
 * Theme is driven by CSS variables (see globals.css + ThemeProvider), so the
 * whole site re-skins from a single config object or the backend /config
 * endpoint without touching component code.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          dark: "rgb(var(--color-primary-dark) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
          dark: "rgb(var(--color-secondary-dark) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(42, 72, 126, 0.25)",
        card: "0 4px 20px -4px rgba(42, 72, 126, 0.13), 0 2px 6px -2px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
