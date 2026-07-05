"use client";
import type { IconType } from "react-icons";

/** Gradient avatar from initials. */
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const gradients = [
    "from-primary to-emerald-500",
    "from-secondary to-blue-400",
    "from-amber-400 to-orange-500",
    "from-rose-400 to-pink-500",
    "from-violet-500 to-purple-400",
    "from-emerald-500 to-teal-400",
  ];
  const hue = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % gradients.length;

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white ${gradients[hue]}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials || "?"}
    </span>
  );
}

type Tone = "primary" | "secondary" | "amber" | "rose" | "emerald" | "slate";

const TONE: Record<Tone, { icon: string; num: string; ring: string; glow: string }> = {
  primary:   { icon: "bg-primary text-white",          num: "text-primary",   ring: "ring-primary/15",   glow: "from-primary/8 to-transparent" },
  secondary: { icon: "bg-secondary text-white",        num: "text-secondary", ring: "ring-secondary/15", glow: "from-secondary/8 to-transparent" },
  amber:     { icon: "bg-gradient-to-br from-amber-400 to-orange-400 text-white", num: "text-amber-600",   ring: "ring-amber-200",   glow: "from-amber-50 to-transparent" },
  rose:      { icon: "bg-gradient-to-br from-rose-400 to-pink-500 text-white",    num: "text-rose-500",    ring: "ring-rose-200",    glow: "from-rose-50 to-transparent" },
  emerald:   { icon: "bg-gradient-to-br from-emerald-400 to-teal-500 text-white", num: "text-emerald-600", ring: "ring-emerald-200", glow: "from-emerald-50 to-transparent" },
  slate:     { icon: "bg-gradient-to-br from-slate-400 to-slate-500 text-white",  num: "text-slate-600",   ring: "ring-slate-200",   glow: "from-slate-50 to-transparent" },
};

/** Dashboard stat card — horizontal icon + number layout. */
export function StatCard({
  icon: Icon,
  label,
  value,
  tone = "primary",
}: {
  icon: IconType;
  label: string;
  value: string | number;
  tone?: Tone;
}) {
  const t = TONE[tone];
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white p-4 ring-1 shadow-card ${t.ring} sm:p-5`}>
      {/* Subtle corner glow */}
      <div className={`pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-bl ${t.glow} opacity-60 blur-2xl`} />

      <div className="relative flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base shadow-sm sm:h-11 sm:w-11 sm:text-lg ${t.icon}`}>
          <Icon />
        </div>
        <p className={`text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl ${t.num}`}>{value}</p>
      </div>
      <p className="relative mt-3 text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
    </div>
  );
}

const PILL: Record<string, string> = {
  confirmed:   "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  cancelled:   "bg-rose-50   text-rose-600   ring-1 ring-rose-200",
  rescheduled: "bg-amber-50  text-amber-700  ring-1 ring-amber-200",
  completed:   "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  no_show:     "bg-slate-100 text-slate-600  ring-1 ring-slate-300",
};

const PILL_LABEL: Record<string, string> = {
  confirmed:   "Confirmed",
  cancelled:   "Cancelled",
  rescheduled: "Rescheduled",
  completed:   "Completed",
  no_show:     "No-show",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        PILL[status] ?? "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {PILL_LABEL[status] ?? status}
    </span>
  );
}

/** Simple card wrapper used across panels. */
export function PanelCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-slate-100 bg-white shadow-card ${className}`}>
      {children}
    </div>
  );
}
