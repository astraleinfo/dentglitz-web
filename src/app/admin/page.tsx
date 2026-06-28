"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  LuCalendarCheck2, LuCalendarClock, LuUserCircle,
  LuLogOut, LuChevronLeft, LuChevronRight,
} from "react-icons/lu";
import { FaSignOutAlt } from "react-icons/fa";

import { clearSession, getSession, isSessionExpired, saveSession } from "@/lib/api";
import type { AuthSession } from "@/lib/types";
import { useSiteConfig } from "@/components/ThemeProvider";
import { Avatar } from "@/components/admin/ui";
import { BookingsPanel } from "@/components/admin/BookingsPanel";
import { AvailabilityPanel } from "@/components/admin/AvailabilityPanel";
import { ProfilePanel } from "@/components/admin/ProfilePanel";

type Tab = "bookings" | "availability" | "profile";

const NAV: { id: Tab; label: string; shortLabel: string; icon: IconType }[] = [
  { id: "bookings",     label: "Appointments", shortLabel: "Bookings", icon: LuCalendarCheck2 },
  { id: "availability", label: "Availability", shortLabel: "Hours",    icon: LuCalendarClock },
  { id: "profile",      label: "My Profile",   shortLabel: "Profile",  icon: LuUserCircle },
];

function todayLabel() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long", day: "numeric", month: "long",
  });
}

export default function AdminDashboard() {
  const cfg = useSiteConfig();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [tab, setTab] = useState<Tab>("bookings");
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const s = getSession();
    if (!s || isSessionExpired()) {
      clearSession();
      router.replace("/admin/login");
      return;
    }
    setSession(s);

    // Redirect mid-session if the token silently expires
    const interval = setInterval(() => {
      if (isSessionExpired()) {
        clearSession();
        router.replace("/admin/login");
      }
    }, 60_000);

    return () => clearInterval(interval);
  }, [router]);

  if (!session) return null;

  const active = NAV.find((i) => i.id === tab) ?? NAV[0];

  function logout() {
    clearSession();
    router.replace("/admin/login");
  }

  function handleNameChange(name: string) {
    const updated = { ...session!, name };
    setSession(updated);
    saveSession(updated);
  }

  function handleEmailChange(email: string) {
    const updated = { ...session!, email };
    setSession(updated);
    saveSession(updated);
  }

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* ════════════════════════ Desktop Sidebar ════════════════════════ */}
      {/* Outer wrapper: sticky + relative so the edge button can overflow */}
      <div
        className={`relative sticky top-0 hidden h-screen shrink-0 lg:block transition-[width] duration-300 ease-in-out ${
          collapsed ? "w-[76px]" : "w-64"
        }`}
      >
        {/* Collapse toggle — right edge pill */}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-[88px] z-20 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-md transition-colors hover:border-primary/40 hover:text-primary"
        >
          {collapsed
            ? <LuChevronRight className="text-[11px]" />
            : <LuChevronLeft className="text-[11px]" />
          }
        </button>

      <aside
        className="sidebar-bg flex h-full w-full flex-col overflow-hidden"
      >
        {/* Dot-grid texture */}
        <div className="sidebar-mesh pointer-events-none absolute inset-0 opacity-[0.04]" />
        {/* Top ambient glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/8 to-transparent" />

        {/* ── Logo ── */}
        <div className={`relative flex h-[68px] shrink-0 items-center border-b border-white/[0.07] ${
          collapsed ? "justify-center px-0" : "gap-3 px-5"
        }`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cfg.logoUrl}
            alt={cfg.clinicName}
            className="h-9 w-9 shrink-0 rounded-[10px] logo-bg object-contain p-1.5 ring-1 ring-white/10 shadow-lg"
          />
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold tracking-tight text-white leading-tight">
                {cfg.clinicName}
              </p>
              <p className="text-[10px] font-medium tracking-wide text-white/30">Admin Portal</p>
            </div>
          )}
        </div>

        {/* ── Nav ── */}
        <nav className="flex flex-1 flex-col px-3 py-4">
          {!collapsed && (
            <p className="mb-2 mt-1 px-2 text-[9px] font-bold uppercase tracking-[0.15em] text-white/20">
              Navigation
            </p>
          )}

          <div className={`flex flex-col ${collapsed ? "items-center gap-1.5" : "gap-0.5"}`}>
            {NAV.map((n) => {
              const Icon = n.icon;
              const on = tab === n.id;

              /* ── Collapsed: icon-only pill ── */
              if (collapsed) {
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setTab(n.id)}
                    title={n.label}
                    aria-label={n.label}
                    className={`nav-icon-btn relative flex h-[52px] w-[52px] items-center justify-center rounded-2xl transition-all duration-200 ${
                      on
                        ? "nav-icon-active shadow-lg"
                        : "hover:bg-white/8 text-white/35 hover:text-white/70"
                    }`}
                  >
                    <Icon className={`relative text-[20px] transition-colors duration-200 ${on ? "text-white" : ""}`} />
                  </button>
                );
              }

              /* ── Expanded: icon + label row ── */
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setTab(n.id)}
                  className={`group relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                    on
                      ? "bg-white/8 text-white"
                      : "text-white/40 hover:bg-white/5 hover:text-white/70"
                  }`}
                >
                  {/* Left accent line */}
                  {on && (
                    <span className="nav-accent-line absolute left-0 top-1/2 h-[55%] w-[3px] -translate-y-1/2 rounded-r-full" />
                  )}

                  {/* Icon pill */}
                  <span
                    className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-150 ${
                      on
                        ? "nav-icon-active"
                        : "bg-white/6 group-hover:bg-white/10"
                    }`}
                  >
                    <Icon
                      className={`text-[15px] transition-colors duration-150 ${
                        on ? "text-white" : "text-white/40 group-hover:text-white/65"
                      }`}
                    />
                  </span>

                  <span className="flex-1 text-left text-[13px]">{n.label}</span>

                  {on && <span className="h-1.5 w-1.5 rounded-full bg-white/40" />}
                </button>
              );
            })}
          </div>

          <div className="flex-1" />
        </nav>

        {/* ── User footer ── */}
        <div className="border-t border-white/[0.07] p-3">
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <Avatar name={session.name} size={36} />
              <button
                type="button"
                onClick={logout}
                title="Log out"
                aria-label="Log out"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/20 transition hover:text-rose-400"
              >
                <LuLogOut className="text-sm" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 rounded-xl bg-white/5 p-2.5 ring-1 ring-white/[0.06]">
              <Avatar name={session.name} size={32} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white leading-tight">{session.name}</p>
                <p className="text-[10px] text-white/30">{session.email}</p>
              </div>
              <button
                type="button"
                onClick={logout}
                title="Log out"
                aria-label="Log out"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/10 hover:text-rose-400"
              >
                <LuLogOut className="text-sm" />
              </button>
            </div>
          )}
        </div>
      </aside>
      </div>{/* end sticky wrapper */}

      {/* ════════════════════════ Main area ════════════════════════ */}
      <div className="flex min-w-0 flex-1 flex-col pb-nav-safe lg:pb-0">

        {/* ── Header ── */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 sm:h-16 sm:px-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cfg.logoUrl}
              alt={cfg.clinicName}
              className="h-8 w-8 shrink-0 rounded-xl bg-primary/8 object-contain p-1 lg:hidden"
            />
            <div>
              <h1 className="text-base font-bold leading-tight text-secondary sm:text-lg">{active.label}</h1>
              <p className="hidden text-xs text-slate-400 sm:block">{todayLabel()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <Avatar name={session.name} size={32} />
              <span className="hidden text-sm font-semibold text-secondary md:block">
                {session.name.split(" ")[0]}
              </span>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Log out"
              aria-label="Log out"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 lg:hidden"
            >
              <FaSignOutAlt className="text-sm" />
            </button>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="flex-1 p-4 sm:p-5 lg:p-7">
          {tab === "bookings"     && <BookingsPanel />}
          {tab === "availability" && <AvailabilityPanel />}
          {tab === "profile"      && <ProfilePanel session={session} onNameChange={handleNameChange} onEmailChange={handleEmailChange} />}
        </main>
      </div>

      {/* ════════════════════════ Mobile bottom tab bar ════════════════════════ */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-100 bg-white/95 backdrop-blur-md pb-safe lg:hidden">
        <div className="flex items-stretch px-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            const on = tab === n.id;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setTab(n.id)}
                className="relative flex flex-1 flex-col items-center gap-1 py-2 transition-all duration-150 active:scale-[0.93]"
              >
                {/* Active indicator bar at top */}
                <span
                  className={`absolute inset-x-5 top-0 h-[2.5px] rounded-b-full transition-all duration-200 ${
                    on ? "bg-primary opacity-100" : "opacity-0"
                  }`}
                />
                {/* Icon container */}
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                    on ? "nav-icon-active shadow-sm" : ""
                  }`}
                >
                  <Icon
                    className={`transition-all duration-200 ${
                      on ? "text-[16px] text-white" : "text-[15px] text-slate-400"
                    }`}
                  />
                </span>
                {/* Label */}
                <span
                  className={`text-[10px] font-bold leading-none tracking-wide ${
                    on ? "text-primary" : "text-slate-400"
                  }`}
                >
                  {n.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
