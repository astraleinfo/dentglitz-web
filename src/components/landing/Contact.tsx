"use client";

import { useEffect, useRef } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { useSiteConfig } from "@/components/ThemeProvider";
import { BookAppointmentButton } from "@/components/booking/BookAppointmentButton";
import { LuArrowRight } from "react-icons/lu";
import type { IconType } from "react-icons";

type ContactCard = {
  icon: IconType;
  label: string;
  value: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  tooltip?: string;
  href?: string;
};

export function Contact() {
  const cfg = useSiteConfig();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.08 },
    );
    sectionRef.current
      ?.querySelectorAll(".reveal, .reveal-left, .reveal-right")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const contactCards: ContactCard[] = [
    {
      icon: FaMapMarkerAlt,
      label: "Our Address",
      value: cfg.address,
      iconBg: "bg-[#1e9b8d]/10",
      iconBorder: "border-[#1e9b8d]/25",
      iconColor: "text-[#1e9b8d]",
      tooltip: cfg.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cfg.address)}`,
    },
    {
      icon: FaPhoneAlt,
      label: "Phone Number",
      value: cfg.phone,
      iconBg: "bg-[#2a487e]/10",
      iconBorder: "border-[#2a487e]/25",
      iconColor: "text-[#2a487e]",
      href: `tel:${cfg.phone.replace(/\s+/g, "")}`,
    },
    {
      icon: FaWhatsapp,
      label: "WhatsApp",
      value: "Chat with Us",
      iconBg: "bg-[#25D366]/10",
      iconBorder: "border-[#25D366]/25",
      iconColor: "text-[#25D366]",
      href: `https://wa.me/${cfg.whatsappNumber.replace(/\D/g, "")}`,
    },
    {
      icon: FaEnvelope,
      label: "Email Address",
      value: cfg.email,
      iconBg: "bg-[#4DD4C5]/12",
      iconBorder: "border-[#4DD4C5]/30",
      iconColor: "text-[#1e9b8d]",
      href: `mailto:${cfg.email}`,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden scroll-mt-28 py-8 sm:py-16 lg:py-24"
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[400px] w-[400px] rounded-full bg-[#4DD4C5]/12 blur-[120px] sm:h-[500px] sm:w-[500px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-[#2a487e]/10 blur-[120px] sm:h-[500px] sm:w-[500px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="reveal mb-7 text-center sm:mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1e9b8d]/30 bg-[#1e9b8d]/8 px-4 py-1.5 sm:mb-5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#1e9b8d]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1e9b8d] sm:text-[11px]">
              Contact Us
            </span>
          </div>

          <h2
            className="mb-3 text-[1.45rem] font-extrabold leading-[1.12] text-[#071224] sm:text-3xl lg:text-4xl xl:text-[2.75rem]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Get in{" "}
            <span className="bg-gradient-to-r from-[#1e9b8d] to-[#4DD4C5] bg-clip-text text-transparent">
              Touch With Us
            </span>
          </h2>

          <div className="mx-auto mb-4 h-0.5 w-12 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#4DD4C5] sm:mb-5" />

          <p
            className="mx-auto max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            We&apos;re here to help. Reach out via any of the following or book
            an appointment directly.
          </p>
        </div>

        {/* ── Two-column layout — single column on mobile/tablet, 2-col only on lg+ ── */}
        <div className="grid gap-5 sm:gap-7 lg:grid-cols-[1fr_1.2fr] lg:items-stretch lg:gap-10">

          {/* LEFT — Contact cards + CTA */}
          <div className="reveal-left">
            <div className="mb-5 sm:mb-6">
              <h3
                className="mb-2 text-base font-extrabold text-[#071224] sm:text-lg"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Contact Information
              </h3>
              <div className="h-0.5 w-8 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#4DD4C5]" />
            </div>

            {/* Cards grid — 1 col on mobile, 2 col on sm, 1 col inside lg left panel */}
            <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-1">
              {contactCards.map(
                ({
                  icon: Icon,
                  label,
                  value,
                  iconBg,
                  iconBorder,
                  iconColor,
                  tooltip,
                  href,
                }) => (
                  <div key={label} className="group relative">

                    {/* Tooltip — address only, appears above on hover (desktop only) */}
                    {tooltip && (
                      <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-3 w-full opacity-0 -translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 hidden sm:block">
                        <div className="relative overflow-hidden rounded-2xl border border-[#4DD4C5]/25 bg-[#071224] px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.45),_0_0_0_1px_rgba(77,212,197,0.08)] backdrop-blur-md">
                          {/* Top accent bar */}
                          <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-[#4DD4C5] to-[#1e9b8d]" />
                          {/* Label */}
                          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#4DD4C5]/70" style={{ fontFamily: "var(--font-sans)" }}>
                            Full Address
                          </p>
                          {/* Address */}
                          <p className="text-[12.5px] leading-relaxed text-white/80" style={{ fontFamily: "var(--font-sans)" }}>
                            {tooltip}
                          </p>
                          {/* Arrow pointing down */}
                          <div className="absolute -bottom-[5px] left-6 h-2.5 w-2.5 rotate-45 border-b border-r border-[#4DD4C5]/20 bg-[#071224]" />
                        </div>
                      </div>
                    )}

                    <a
                      href={href}
                      target={href?.startsWith("http") ? "_blank" : undefined}
                      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="relative flex items-center gap-2.5 overflow-hidden rounded-xl border border-white/80 bg-white/65 p-3 backdrop-blur-sm shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition-all duration-300 sm:gap-3 sm:rounded-2xl sm:p-4 hover:-translate-y-0.5 hover:border-[#1e9b8d]/25 hover:bg-white/85 hover:shadow-[0_12px_40px_rgba(30,155,141,0.10)]"
                    >
                      {/* Icon */}
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border sm:h-10 sm:w-10 sm:rounded-xl ${iconBorder} ${iconBg} transition-all duration-300 group-hover:scale-105`}
                      >
                        <Icon className={`h-4 w-4 ${iconColor}`} />
                      </div>

                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400 sm:text-[10px] sm:tracking-[0.12em]"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          {label}
                        </p>
                        <p
                          className="mt-0.5 truncate text-xs font-semibold text-[#071224] transition-colors duration-300 sm:text-sm group-hover:text-[#1e9b8d]"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          {value}
                        </p>
                      </div>
                    </a>
                  </div>
                ),
              )}
            </div>

            <BookAppointmentButton
              label={
                <span className="flex items-center justify-center gap-2.5">
                  Book Appointment Now
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <LuArrowRight className="h-3.5 w-3.5" />
                  </span>
                </span>
              }
              className="transform-gpu mt-4 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] py-3 text-sm font-bold text-white shadow-[0_4px_20px_rgba(30,155,141,0.35)] transition-all duration-300 hover:from-[#25b8a8] hover:to-[#344f8c] hover:shadow-[0_8px_32px_rgba(30,155,141,0.55)] sm:mt-5 sm:py-3.5"
              trackingId="contact_section"
            />
          </div>

          {/* RIGHT — Map */}
          <div className="reveal-right flex flex-col">

            {/* Map — fills full column height on lg, fixed on mobile */}
            <div className="h-[200px] flex-1 overflow-hidden rounded-[16px] border border-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:h-[260px] sm:rounded-[20px] lg:h-full lg:min-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3694.6191766599095!2d80.15281097484257!3d13.03937538728225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52610357adbee1%3A0xed169005bf60e53a!2sDentglitz-The%20complete%20Dental%20Care!5e1!3m2!1sen!2sin!4v1781447913392!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dentglitz Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
