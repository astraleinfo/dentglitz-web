"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { LuMenu, LuX, LuPhone, LuChevronDown, LuImage, LuNewspaper, LuSparkles } from "react-icons/lu";
import { FaCalendarAlt } from "react-icons/fa";
import { useSiteConfig } from "@/components/ThemeProvider";
import { BookAppointmentButton } from "@/components/booking/BookAppointmentButton";

type NavLink = { href: string; label: string };

type NavDropdown = {
  label: string;
  children: { href: string; label: string; icon: React.ReactNode; desc: string }[];
};

type NavItem = NavLink | NavDropdown;

const isDropdown = (item: NavItem): item is NavDropdown => "children" in item;

const navItems: NavItem[] = [
  { href: "#top",      label: "Home" },
  { href: "#about",    label: "About" },
  { href: "#services", label: "Treatments" },
  { href: "#doctors",  label: "Doctors" },
  {
    label: "Media",
    children: [
      { href: "#transformations", label: "Transformations", icon: <LuSparkles   className="h-4 w-4" />, desc: "Before & after smile results" },
      { href: "#gallery",         label: "Gallery",         icon: <LuImage      className="h-4 w-4" />, desc: "Clinic photos & smile makeovers" },
      { href: "#updates",         label: "Updates",         icon: <LuNewspaper  className="h-4 w-4" />, desc: "Camps, events & news" },
    ],
  },
  { href: "#reviews",  label: "Reviews" },
  { href: "#contact",  label: "Contact" },
];

// All hrefs that count as "links" for active-section tracking
const allLinks: NavLink[] = navItems.flatMap((item) =>
  isDropdown(item) ? item.children.map(({ href, label }) => ({ href, label })) : [item]
);

export function Navbar({ lightText = false }: { lightText?: boolean }) {
  const cfg = useSiteConfig();
  const pathname = usePathname();

  const pathnameToHref: Record<string, string> = {
    "/gallery":         "#gallery",
    "/transformations": "#transformations",
    "/updates":         "#updates",
    "/about":           "#about",
  };

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => pathnameToHref[pathname] ?? "#top");
  const [scrolled, setScrolled] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);       // desktop dropdown
  const [mobileMediaOpen, setMobileMediaOpen] = useState(false); // mobile accordion
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = allLinks.map((l) => l.href.slice(1)).filter(Boolean);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMediaOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openDropdown  = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setMediaOpen(true);  };
  const closeDropdown = () => { closeTimer.current = setTimeout(() => setMediaOpen(false), 120); };

  // On sub-pages, anchor links need a leading / to navigate back to home first
  const resolveHref = (href: string) =>
    href.startsWith("#") && pathname !== "/" ? `/${href}` : href;

  // Non-scrolled text colour — white over dark heroes (sub-pages), dark over light/transparent (home)
  const dimText  = lightText ? "text-white/80 hover:text-white"  : "text-black/75 hover:text-black";
  const iconText = "text-black hover:text-black";

  const mediaItem = navItems.find(isDropdown)!;
  const isMediaActive = mediaItem.children.some((c) => c.href === active);

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? "left-4 right-4 top-3 md:left-6 md:right-6 xl:left-10 xl:right-10"
          : "inset-x-0 top-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent"
      }`}
    >
      {/* ── Main row ── */}
      <div
        className={`flex items-center gap-4 transition-all duration-500 ${
          scrolled
            ? "rounded-2xl bg-[#071224]/92 px-5 py-2.5 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(77,212,197,0.18)]"
            : "px-6 py-4 lg:px-8"
        }`}
      >
        {/* Logo */}
        <a href="/" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cfg.logoUrl}
            alt={cfg.clinicName}
            className={`w-auto transition-all duration-500 ${scrolled ? "h-10 sm:h-12" : "h-12 sm:h-20"}`}
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center min-[1165px]:flex">
          {navItems.map((item) => {
            if (!isDropdown(item)) {
              return (
                <a
                  key={item.href}
                  href={resolveHref(item.href)}
                  onClick={() => setActive(item.href)}
                  aria-current={active === item.href ? "page" : undefined}
                  className={`relative px-3.5 py-2 text-[13px] font-medium tracking-wide transition-all duration-200 ${
                    active === item.href
                      ? "text-[#4DD4C5]"
                      : scrolled
                        ? "text-black/85 hover:text-black"
                        : dimText
                  }`}
                >
                  {item.label}
                  {active === item.href && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[#4DD4C5] transition-all duration-300" />
                  )}
                </a>
              );
            }

            /* ── Media dropdown ── */
            return (
              <div
                key={item.label}
                ref={dropdownRef}
                className="relative"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                <button
                  onClick={() => setMediaOpen((v) => !v)}
                  className={`relative flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium tracking-wide transition-all duration-200 ${
                    isMediaActive
                      ? "text-[#4DD4C5]"
                      : scrolled
                        ? "text-black/85 hover:text-black"
                        : dimText
                  }`}
                >
                  {item.label}
                  <LuChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${mediaOpen ? "rotate-180" : ""}`}
                  />
                  {isMediaActive && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[#4DD4C5] transition-all duration-300" />
                  )}
                </button>

                {/* Dropdown panel */}
                <div
                  className={`absolute left-1/2 top-full mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/20 bg-[#071224]/95 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-200 ${
                    mediaOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
                  }`}
                >
                  <div className="p-2">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={resolveHref(child.href)}
                        onClick={() => { setActive(child.href); setMediaOpen(false); }}
                        className={`flex items-start gap-3 rounded-xl px-3 py-3 transition-all duration-150 hover:bg-white/8 ${
                          active === child.href ? "bg-[#4DD4C5]/10" : ""
                        }`}
                      >
                        <span className={`mt-0.5 shrink-0 ${active === child.href ? "text-[#4DD4C5]" : "text-white/50"}`}>
                          {child.icon}
                        </span>
                        <div>
                          <p className={`text-sm font-semibold ${active === child.href ? "text-[#4DD4C5]" : "text-white/90"}`}>
                            {child.label}
                          </p>
                          <p className="text-[11px] text-white/45">{child.desc}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden shrink-0 items-center gap-4 min-[1165px]:flex ml-auto">
          <a href={`tel:${cfg.phone}`} className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#4DD4C5]/40 bg-[#4DD4C5]/10 transition-all duration-300 group-hover:bg-[#4DD4C5]/20 group-hover:border-[#4DD4C5]/60">
              <LuPhone className="h-3.5 w-3.5 text-[#4DD4C5]" />
            </div>
            <span
              className={`text-sm font-semibold transition-colors duration-200 ${
                scrolled ? "text-black/85 hover:text-black" : dimText
              }`}
            >
              {cfg.phone}
            </span>
          </a>

          <BookAppointmentButton
            label={
              <span className="flex items-center gap-2">
                <FaCalendarAlt className="h-3.5 w-3.5" />
                Book Appointment
              </span>
            }
            className="flex items-center rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(30,155,141,0.35)] transition-all duration-300 hover:from-[#25b8a8] hover:to-[#344f8c] hover:scale-[1.03] hover:shadow-[0_6px_28px_rgba(30,155,141,0.55)]"
          />
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className={`relative ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 min-[1165px]:hidden ${iconText} ${
            scrolled
              ? "border-white/15 bg-white/5 hover:bg-white/10"
              : "border-white/25 bg-white/10 backdrop-blur-sm hover:bg-white/15"
          }`}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className={`absolute transition-all duration-200 ${open ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}>
            <LuX className="h-5 w-5" />
          </span>
          <span className={`absolute transition-all duration-200 ${open ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"}`}>
            <LuMenu className="h-5 w-5" />
          </span>
        </button>
      </div>

      {/* ── Mobile menu ── */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out min-[1165px]:hidden ${
          open ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mt-2 flex flex-col gap-1 rounded-2xl border border-white/10 bg-[#071224]/95 px-4 py-4 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
          {navItems.map((item) => {
            if (!isDropdown(item)) {
              return (
                <a
                  key={item.href}
                  href={resolveHref(item.href)}
                  onClick={() => { setActive(item.href); setOpen(false); }}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    active === item.href
                      ? "border-l-2 border-[#4DD4C5] bg-[#4DD4C5]/10 pl-[14px] text-[#4DD4C5]"
                      : "border-l-2 border-transparent pl-[14px] text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              );
            }

            /* ── Media accordion ── */
            return (
              <div key={item.label}>
                <button
                  onClick={() => setMobileMediaOpen((v) => !v)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isMediaActive
                      ? "border-l-2 border-[#4DD4C5] bg-[#4DD4C5]/10 pl-[14px] text-[#4DD4C5]"
                      : "border-l-2 border-transparent pl-[14px] text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                  <LuChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${mobileMediaOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    mobileMediaOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-white/10 pl-3">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={resolveHref(child.href)}
                        onClick={() => { setActive(child.href); setOpen(false); }}
                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all duration-150 ${
                          active === child.href
                            ? "bg-[#4DD4C5]/10 text-[#4DD4C5]"
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span className="shrink-0">{child.icon}</span>
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="mt-3 flex flex-col gap-2.5 border-t border-white/10 pt-4">
            <a
              href={`tel:${cfg.phone}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#4DD4C5]/30 bg-[#4DD4C5]/8 py-3 text-sm font-semibold text-[#4DD4C5] transition-all hover:bg-[#4DD4C5]/15 hover:border-[#4DD4C5]/50"
            >
              <LuPhone className="h-4 w-4" /> {cfg.phone}
            </a>
            <BookAppointmentButton
              label={
                <span className="flex items-center justify-center gap-2">
                  <FaCalendarAlt className="h-4 w-4" />
                  Book Appointment
                </span>
              }
              className="w-full rounded-xl bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(30,155,141,0.35)] transition-all duration-300 hover:from-[#25b8a8] hover:to-[#344f8c] hover:shadow-[0_6px_24px_rgba(30,155,141,0.5)]"
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
