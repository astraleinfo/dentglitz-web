"use client";

import { useEffect } from "react";
import { useSiteConfig } from "@/components/ThemeProvider";
import { BookAppointmentButton } from "@/components/booking/BookAppointmentButton";
import { LuArrowRight, LuShieldCheck, LuUsers, LuStar, LuPhone } from "react-icons/lu";
import { FaWhatsapp, FaTooth, FaCalendarAlt } from "react-icons/fa";
import { socialLinks, clinicStats } from "@/config/clinic.data";
import { media } from "@/config/media";
import Image from "next/image";

const trustBadges = [
  { icon: LuShieldCheck, label: "Experienced Specialists" },
  { icon: LuStar,        label: "Advanced Technology" },
  { icon: LuUsers,       label: `${clinicStats.happyPatients}+ Happy Patients` },
];

const achievementCards = [
  { icon: FaTooth,       value: `${clinicStats.yearsOfExperience}+`,       label: "Years of Experience" },
  { icon: LuUsers,       value: `${clinicStats.doctorsCount}+`,             label: "Specialized Doctors" },
  { icon: FaCalendarAlt, value: `${clinicStats.yearsInService}+`,           label: "Years of Service" },
  { icon: LuStar,        value: `${clinicStats.satisfactionPercent}%`,      label: "Patient Satisfaction" },
  { icon: LuShieldCheck, value: `${clinicStats.happyPatients}+`,            label: "Happy Smiles" },
];

export function Hero() {
  const cfg = useSiteConfig();

  useEffect(() => {
    document.querySelectorAll(".hero-reveal").forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), i * 400);
    });
  }, []);

  return (
    <>
      {/* ── Floating Call (mobile only) ── */}
      <a
        href={`tel:${cfg.phone}`}
        aria-label="Call us"
        className="fixed bottom-24 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1e9b8d] to-[#2a487e] shadow-[0_8px_28px_rgba(30,155,141,0.5)] transition-all hover:scale-110 hover:shadow-[0_12px_40px_rgba(30,155,141,0.65)] animate-glow-ring lg:hidden"
      >
        <LuPhone className="h-6 w-6 text-white" />
      </a>

      {/* ── Floating WhatsApp ── */}
      <a
        href={`https://wa.me/${cfg.whatsappNumber.replace(/\D/g, "")}`}
        aria-label="WhatsApp"
        className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_8px_30px_rgba(37,211,102,0.5)] transition-all hover:scale-110 hover:shadow-[0_12px_40px_rgba(37,211,102,0.6)] animate-glow-ring"
      >
        <FaWhatsapp className="h-7 w-7 text-white" />
      </a>

      {/* ── Floating Book Now — bottom-center on mobile/tablet ── */}
      <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 lg:hidden">
        <BookAppointmentButton
          label={
            <span className="flex items-center gap-2 text-sm font-bold">
              <FaTooth className="h-4 w-4" />
              Book Now
            </span>
          }
          className="rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] px-7 py-3.5 text-white
                     shadow-[0_4px_12px_rgba(0,0,0,0.15),_0_8px_28px_rgba(30,155,141,0.50)]
                     transition-all duration-300 hover:scale-[1.04]
                     hover:shadow-[0_6px_16px_rgba(0,0,0,0.15),_0_12px_40px_rgba(30,155,141,0.65)]
                     active:scale-[0.97]"
          trackingId="hero_floating_mobile"
        />
      </div>

      {/* ── Back to Top ── */}
      <a
        href="#top"
        aria-label="Back to top"
        className="fixed bottom-6 left-6 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-all hover:bg-[#1e9b8d] hover:text-white hover:scale-110 text-slate-500"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </a>

      <section
        id="top"
        className="relative flex min-h-screen items-start overflow-hidden bg-[#071224] lg:items-center"
      >
        {/* ── Background: dark overlay + photo ── */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Image
            src={media.heroBackground}
            alt="background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071224]/97 via-[#071224]/90 to-[#071224]/55" />
          {/* <div className="absolute inset-0 bg-gradient-to-t from-[#071224]/90 via-transparent to-[#071224]/65" /> */}
        </div>

        {/* ── Glow blobs ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#1e9b8d]/10 blur-[120px] animate-blob" />
          <div className="absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-[#2a487e]/15 blur-[100px] animate-blob delay-400" />
          <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-[#4DD4C5]/8 blur-[80px] animate-blob delay-700" />
        </div>

        {/* ── Animated particles ── */}
        {/* <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-[#4DD4C5]/50"
              style={{
                left: `${10 + i * 7.5}%`,
                top: `${15 + (i % 5) * 17}%`,
                animation: `particle-float ${4 + (i % 4)}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div> */}

        {/* ── Left social bar ── */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col items-center gap-3">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-400/40 text-gray-400 transition-all hover:border-[#4DD4C5]/50 hover:text-[#4DD4C5] hover:bg-[#4DD4C5]/10"
            >
              <Icon className="h-3.5 w-3.5" />
            </a>
          ))}
          <div className="mt-2 h-14 w-px bg-gradient-to-b from-gray-400/40 to-transparent" />
        </div>

        {/* ── Main grid ── */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-32 pb-28 sm:px-8 sm:pt-28 sm:pb-20 lg:px-12 xl:pl-10 xl:pr-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">

            {/* LEFT: Content */}
            <div className="max-w-2xl">

              {/* Badge */}
              <div className="hero-reveal reveal mb-5 inline-flex items-center gap-2 rounded-full border border-[#4DD4C5]/30 bg-[#4DD4C5]/8 px-4 py-1.5 backdrop-blur-sm" >
                <svg className="h-3.5 w-3.5 shrink-0 text-[#4DD4C5]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                <span className="text-[11px] font-semibold tracking-wide bg-gradient-to-r from-[#37998e] to-[#000b0a] bg-clip-text text-transparent">
                  Premium Dental Care for a Perfect Smile
                </span>
              </div>

              {/* Heading */}
              <h1
                className="hero-reveal reveal mb-5 text-[2rem] font-extrabold leading-[1.1] text-black/90 sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Transforming
                <br />
                Smiles with
                <span className="block bg-gradient-to-r from-[#37998e] to-[#000b0a] bg-clip-text text-transparent">
                  Precision &amp; Excellence
                </span>
              </h1>

              {/* Description */}
              <p
                className="hero-reveal reveal mb-8 text-base leading-relaxed text-black/75"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Experience comprehensive dental care with advanced technology, personalized treatment and a commitment to creating healthy, confident&nbsp;smiles.
              </p>

              {/* CTA buttons */}
              <div className="hero-reveal reveal mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <BookAppointmentButton
                  label={
                    <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                      <FaCalendarAlt className="h-3.5 w-3.5 shrink-0" />
                      Book Appointment
                    </span>
                  }
                  className="group flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] px-3 py-2.5 text-xs font-bold text-white shadow-[0_4px_16px_rgba(30,155,141,0.35)] transition-all duration-300 hover:from-[#25b8a8] hover:to-[#344f8c] hover:scale-[1.03] hover:shadow-[0_6px_28px_rgba(30,155,141,0.55)]"
                  trackingId="hero_main"
                />
                <a
                  href="#services"
                  className="group flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#1e9b8d] bg-white px-3 py-2.5 text-xs font-semibold text-[#1F2937] shadow-[0_2px_10px_rgba(30,155,141,0.14)] transition-all duration-300 hover:scale-[1.03] hover:bg-[#f0faf9] hover:shadow-[0_6px_24px_rgba(30,155,141,0.28)]"
                >
                  <FaTooth className="h-3.5 w-3.5 shrink-0 text-[#1e9b8d] transition-transform duration-300 group-hover:scale-110" />
                  Explore Treatments
                </a>
                <a
                  href="#doctors"
                  className="group flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#1e9b8d] bg-white px-3 py-2.5 text-xs font-semibold text-[#1F2937] shadow-[0_2px_10px_rgba(30,155,141,0.14)] transition-all duration-300 hover:scale-[1.03] hover:bg-[#f0faf9] hover:shadow-[0_6px_24px_rgba(30,155,141,0.28)]"
                >
                  <LuUsers className="h-3.5 w-3.5 shrink-0 text-[#1e9b8d] transition-transform duration-300 group-hover:scale-110" />
                  Meet Our Doctors
                </a>
              </div>

              {/* Trust badges */}
              <div className="hero-reveal reveal rounded-2xl border border-white/15 bg-white/50 px-4 py-3 backdrop-blur-sm">
                <div className="mx-auto flex w-fit flex-col gap-2 sm:mx-0 sm:w-full sm:flex-row sm:items-center sm:gap-0">
                  {trustBadges.map(({ icon: Icon, label }, i) => (
                    <div key={label} className="flex flex-1 items-center gap-2 sm:justify-center">
                      <Icon className="h-4 w-4 shrink-0 text-[#1e9b8d]" />
                      <span className="text-[11px] font-semibold text-gray-800">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: tooth + achievement cards */}
            <div className="hidden lg:flex lg:items-center lg:justify-center relative min-h-[500px] xl:min-h-[560px]">
              {/* Achievement cards — right column */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3 w-[155px] xl:w-[170px]">
                {achievementCards.map(({ icon: Icon, value, label }, i) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/50 px-3 py-3 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-[#4DD4C5]/25 animate-float-sm"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#4DD4C5]/40 bg-[#4DD4C5]/10">
                      <Icon className="h-4 w-4 text-[#4DD4C5]" />
                    </div>
                    <div>
                      <p
                        className="text-lg font-extrabold leading-none text-black/90"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {value}
                      </p>
                      <p className="mt-0.5 text-[10px] font-medium leading-tight text-black/65">
                        {label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Scroll indicator ── */}
        {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5">
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1">
            <div className="h-2 w-1 animate-bounce rounded-full bg-white/40" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
            Scroll Down
          </span>
        </div> */}
      </section>
    </>
  );
}
