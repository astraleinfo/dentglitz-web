/**
 * ─────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH for branding & theme on the frontend.
 * ─────────────────────────────────────────────────────────────
 *
 * Branding (name, logo, colors, contact) → frontend .env  (NEXT_PUBLIC_*)
 * Scheduling (appointment types, hours)  → backend  .env  (via /config API)
 *
 * The backend never overrides branding — only scheduling fields are
 * merged from the /config response.
 */
export interface AppointmentTypeConfig {
  id: string;
  label: string;
  duration: number;
  desc: string;
}

export interface SiteConfig {
  clinicName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  logoUrl: string;
  logoBgColor: string;
  theme: {
    primary: string;
    secondary: string;
  };
  bookingWidget: {
    logoUrl: string;      // logo shown in the booking panel (can differ from main logo)
    panelFrom: string;    // gradient start colour (hex)
    panelTo: string;      // gradient end colour (hex)
  };
  workingDays: string[];
  workingHours: { start: string; end: string };
  slotDurationMinutes: number;
  appointmentTypes: AppointmentTypeConfig[];
}

export const defaultConfig: SiteConfig = {
  // ── Branding — all from frontend .env (NEXT_PUBLIC_*) ──
  clinicName: process.env.NEXT_PUBLIC_CLINIC_NAME    ?? "Dentglitz",
  tagline:    process.env.NEXT_PUBLIC_TAGLINE        ?? "The Complete Dental Care — Transforming Smiles With Precision & Care",
  logoUrl:     process.env.NEXT_PUBLIC_LOGO_URL       ?? "/dentglitz-logo.svg",
  logoBgColor: process.env.NEXT_PUBLIC_LOGO_BG_COLOR  ?? "#f5deb3",
  phone:      process.env.NEXT_PUBLIC_PHONE          ?? "+91 8248456752",
  email:      process.env.NEXT_PUBLIC_EMAIL          ?? "hello@dentglitz.com",
  address:    process.env.NEXT_PUBLIC_ADDRESS        ?? "1A, Kambar St, near Grace matriculation higher secondary school, Karambakkam, Ponni Nagar, Porur, Chennai, Tamil Nadu 600116",
  theme: {
    primary:   process.env.NEXT_PUBLIC_THEME_PRIMARY   ?? "#1e9b8d",
    secondary: process.env.NEXT_PUBLIC_THEME_SECONDARY ?? "#2a487e",
  },
  bookingWidget: {
    logoUrl:   process.env.NEXT_PUBLIC_BOOKING_LOGO_URL   ?? process.env.NEXT_PUBLIC_LOGO_URL ?? "/dentglitz-logo.svg",
    panelFrom: process.env.NEXT_PUBLIC_BOOKING_PANEL_FROM ?? "#2a487e",
    panelTo:   process.env.NEXT_PUBLIC_BOOKING_PANEL_TO   ?? "#1e9b8d",
  },

  // ── Scheduling — overridden by backend /config response ──
  workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  workingHours: { start: "09:00", end: "20:00" },
  slotDurationMinutes: 30,
  appointmentTypes: [
    { id: "general",  label: "General Consulting",    duration: 15, desc: "Quick check-up or follow-up" },
    { id: "extended", label: "Extended Consultation", duration: 30, desc: "Complex treatment or detailed exam" },
  ],
};

/** Darken a hex color by a percentage — used to derive `*-dark` shades. */
export function darken(hex: string, amount = 0.12): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((n >> 16) & 255) * (1 - amount));
  const g = Math.max(0, ((n >> 8) & 255) * (1 - amount));
  const b = Math.max(0, (n & 255) * (1 - amount));
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}
