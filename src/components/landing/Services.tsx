"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  LuArrowRight, LuShieldCheck, LuSmile, LuX, LuCheck,
  LuActivity, LuAlertCircle, LuScissors, LuSparkles, LuAlignCenter, LuCalendar,
} from "react-icons/lu";
import { FaTeeth, FaTeethOpen } from "react-icons/fa";
import { GiTooth, GiToothbrush } from "react-icons/gi";
import type { IconType } from "react-icons";
import { BookAppointmentButton } from "@/components/booking/BookAppointmentButton";

type Service = {
  icon: IconType;
  title: string;
  desc: string;
  detailIntro: string;
  details: string[];
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  checkColor: string;
  checkBg: string;
  barGradient: string;
};

const services: Service[] = [
  {
    icon: GiToothbrush,
    title: "Preventive Dentistry",
    desc: "Comprehensive dental exams, professional scaling & polishing, oral cancer screening, fluoride therapy, sealants and personalized hygiene guidance.",
    detailIntro: "Maintaining optimal oral health begins with prevention. Our preventive services focus on early diagnosis and disease prevention through:",
    details: [
      "Comprehensive Dental Examinations",
      "Professional Scaling and Polishing",
      "Oral Cancer Screening",
      "Fluoride Therapy",
      "Pit and Fissure Sealants",
      "Personalized Oral Hygiene Guidance",
    ],
    iconBg: "bg-[#1e9b8d]/10",
    iconBorder: "border-[#1e9b8d]/25",
    iconColor: "text-[#1e9b8d]",
    checkColor: "text-[#1e9b8d]",
    checkBg: "bg-[#1e9b8d]/10",
    barGradient: "from-[#1e9b8d] to-[#4DD4C5]",
  },
  {
    icon: FaTeeth,
    title: "Restorative Dentistry",
    desc: "Tooth-colored composite restorations, inlays & onlays, dental crowns, fixed bridges and full mouth rehabilitation to restore function and aesthetics.",
    detailIntro: "We restore the function, integrity and aesthetics of damaged teeth using modern restorative techniques.",
    details: [
      "Tooth-Colored Composite Restorations",
      "Inlays and Onlays",
      "Dental Crowns",
      "Fixed Dental Bridges",
      "Full Mouth Rehabilitation",
    ],
    iconBg: "bg-[#2a487e]/10",
    iconBorder: "border-[#2a487e]/25",
    iconColor: "text-[#2a487e]",
    checkColor: "text-[#2a487e]",
    checkBg: "bg-[#2a487e]/10",
    barGradient: "from-[#2a487e] to-[#1e9b8d]",
  },
  {
    icon: LuActivity,
    title: "Endodontics (Root Canal)",
    desc: "Single-visit root canal therapy, re-treatment of failed canals, post & core restorations and management of dental abscesses — pain-free and precise.",
    detailIntro: "Our advanced endodontic procedures help preserve natural teeth affected by infection or trauma.",
    details: [
      "Single-Visit Root Canal Therapy",
      "Re-treatment of Failed Root Canals",
      "Post and Core Restorations",
      "Management of Dental Abscesses",
    ],
    iconBg: "bg-[#4DD4C5]/12",
    iconBorder: "border-[#4DD4C5]/30",
    iconColor: "text-[#1e9b8d]",
    checkColor: "text-[#1e9b8d]",
    checkBg: "bg-[#4DD4C5]/12",
    barGradient: "from-[#4DD4C5] to-[#1e9b8d]",
  },
  {
    icon: LuSmile,
    title: "Pediatric Dentistry",
    desc: "Preventive care, pediatric restorations, pulp therapy, stainless steel crowns, space maintainers and habit correction in a friendly, child-centered environment.",
    detailIntro: "We provide specialized dental care for infants, children, and adolescents in a friendly and comfortable environment.",
    details: [
      "Preventive Dental Care",
      "Pediatric Restorations",
      "Pulp Therapy (Pulpotomy & Pulpectomy)",
      "Stainless Steel Crowns",
      "Space Maintainers",
      "Habit Correction Therapy",
    ],
    iconBg: "bg-[#1e9b8d]/10",
    iconBorder: "border-[#1e9b8d]/25",
    iconColor: "text-[#1e9b8d]",
    checkColor: "text-[#1e9b8d]",
    checkBg: "bg-[#1e9b8d]/10",
    barGradient: "from-[#1e9b8d] to-[#4DD4C5]",
  },
  {
    icon: LuShieldCheck,
    title: "Periodontics (Gum Care)",
    desc: "Scaling & root planing, management of gingivitis and periodontitis, periodontal maintenance therapy and supportive gum care programs.",
    detailIntro: "Healthy gums are essential for long-term oral health. Our periodontal treatments include:",
    details: [
      "Scaling and Root Planing",
      "Management of Gingivitis and Periodontitis",
      "Periodontal Maintenance Therapy",
      "Supportive Gum Care Programs",
    ],
    iconBg: "bg-[#2a487e]/10",
    iconBorder: "border-[#2a487e]/25",
    iconColor: "text-[#2a487e]",
    checkColor: "text-[#2a487e]",
    checkBg: "bg-[#2a487e]/10",
    barGradient: "from-[#2a487e] to-[#1e9b8d]",
  },
  {
    icon: FaTeethOpen,
    title: "Prosthodontics",
    desc: "Complete, partial and flexible dentures, implant-supported prostheses and crown & bridge restorations — customized solutions for missing teeth.",
    detailIntro: "We offer customized solutions to restore missing teeth and improve oral function.",
    details: [
      "Complete Dentures",
      "Partial Dentures",
      "Flexible Dentures",
      "Implant-Supported Prostheses",
      "Crown and Bridge Restorations",
    ],
    iconBg: "bg-[#4DD4C5]/12",
    iconBorder: "border-[#4DD4C5]/30",
    iconColor: "text-[#1e9b8d]",
    checkColor: "text-[#1e9b8d]",
    checkBg: "bg-[#4DD4C5]/12",
    barGradient: "from-[#4DD4C5] to-[#1e9b8d]",
  },
  {
    icon: GiTooth,
    title: "Dental Implants",
    desc: "Single tooth implants, multiple tooth replacement, full arch rehabilitation and implant-supported dentures for a permanent, natural-looking smile.",
    detailIntro: "Dental implants provide a long-lasting and predictable solution for replacing missing teeth while preserving jawbone health and facial aesthetics.",
    details: [
      "Single Tooth Implants",
      "Multiple Tooth Replacement",
      "Full Arch Rehabilitation",
      "Implant-Supported Dentures",
    ],
    iconBg: "bg-[#1e9b8d]/10",
    iconBorder: "border-[#1e9b8d]/25",
    iconColor: "text-[#1e9b8d]",
    checkColor: "text-[#1e9b8d]",
    checkBg: "bg-[#1e9b8d]/10",
    barGradient: "from-[#1e9b8d] to-[#4DD4C5]",
  },
  {
    icon: LuAlignCenter,
    title: "Orthodontics",
    desc: "Clear aligners, metal braces, ceramic and self-ligation braces, interceptive orthodontics for children and space management solutions.",
    detailIntro: "We help patients achieve properly aligned teeth and balanced smiles through customized orthodontic treatment plans.",
    details: [
      "Clear Aligners",
      "Conventional Metal Braces",
      "Ceramic Braces",
      "Self Ligation Braces",
      "Interceptive Orthodontics for Children",
      "Space Management",
    ],
    iconBg: "bg-[#2a487e]/10",
    iconBorder: "border-[#2a487e]/25",
    iconColor: "text-[#2a487e]",
    checkColor: "text-[#2a487e]",
    checkBg: "bg-[#2a487e]/10",
    barGradient: "from-[#2a487e] to-[#1e9b8d]",
  },
  {
    icon: LuSparkles,
    title: "Cosmetic & Aesthetic Dentistry",
    desc: "Professional teeth whitening, smile designing, ceramic veneers, diastema closure and aesthetic recontouring for a beautiful, confident smile.",
    detailIntro: "Enhance the beauty of your smile with minimally invasive aesthetic treatments.",
    details: [
      "Professional Teeth Whitening",
      "Smile Designing",
      "Ceramic Veneers",
      "Diastema (Gap) Closure",
      "Aesthetic Tooth Recontouring",
    ],
    iconBg: "bg-[#4DD4C5]/12",
    iconBorder: "border-[#4DD4C5]/30",
    iconColor: "text-[#1e9b8d]",
    checkColor: "text-[#1e9b8d]",
    checkBg: "bg-[#4DD4C5]/12",
    barGradient: "from-[#4DD4C5] to-[#1e9b8d]",
  },
  {
    icon: LuScissors,
    title: "Oral Surgery",
    desc: "Simple & surgical extractions, wisdom tooth removal, minor oral surgical procedures and management of dental infections with precision and care.",
    detailIntro: "Our oral surgical services are performed with precision, comfort, and patient safety as top priorities.",
    details: [
      "Simple and Surgical Extractions",
      "Wisdom Tooth Removal",
      "Minor Oral Surgical Procedures",
      "Management of Dental Infections",
    ],
    iconBg: "bg-[#1e9b8d]/10",
    iconBorder: "border-[#1e9b8d]/25",
    iconColor: "text-[#1e9b8d]",
    checkColor: "text-[#1e9b8d]",
    checkBg: "bg-[#1e9b8d]/10",
    barGradient: "from-[#1e9b8d] to-[#4DD4C5]",
  },
  {
    icon: LuAlertCircle,
    title: "Emergency Dental Care",
    desc: "Prompt treatment for severe toothache, dental trauma, swelling & abscesses, fractured teeth and lost restorations — available when you need us most.",
    detailIntro: "Prompt diagnosis and treatment for urgent dental conditions.",
    details: [
      "Severe Toothache",
      "Dental Trauma and Injuries",
      "Swelling and Abscesses",
      "Fractured Teeth",
      "Lost Restorations and Crowns",
    ],
    iconBg: "bg-[#2a487e]/10",
    iconBorder: "border-[#2a487e]/25",
    iconColor: "text-[#2a487e]",
    checkColor: "text-[#2a487e]",
    checkBg: "bg-[#2a487e]/10",
    barGradient: "from-[#2a487e] to-[#1e9b8d]",
  },
];

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<Service | null>(null);
  const [visible, setVisible] = useState(false);

  const openModal = useCallback((service: Service) => {
    setSelected(service);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const closeModal = useCallback(() => {
    setVisible(false);
    setTimeout(() => setSelected(null), 300);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.06 }
    );
    sectionRef.current?.querySelectorAll(".reveal, .reveal-zoom").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, closeModal]);

  return (
    <>
      <section ref={sectionRef} id="services" className="relative overflow-hidden scroll-mt-28 py-20 lg:py-28 bg-gradient-to-b from-slate-50 via-white to-[#f0fafa]/70">
        {/* Soft ambient glows */}
        <div className="pointer-events-none absolute -top-48 -left-48 h-[700px] w-[700px] rounded-full bg-[#4DD4C5]/7 blur-[160px]" />
        <div className="pointer-events-none absolute -bottom-48 -right-48 h-[700px] w-[700px] rounded-full bg-[#2a487e]/6 blur-[160px]" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#1e9b8d]/4 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

          {/* ── Header ── */}
          <div className="reveal mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1e9b8d]/25 bg-[#1e9b8d]/6 px-4 py-1.5 shadow-[0_2px_12px_rgba(30,155,141,0.08)]">
                <span className="h-2 w-2 rounded-full bg-[#1e9b8d] animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1e9b8d]">
                  Our Services
                </span>
              </div>

              <h2
                className="mb-3 text-4xl font-extrabold leading-[1.12] text-[#071224] xl:text-[2.75rem]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Treatments{" "}
                <span className="bg-gradient-to-r from-[#1e9b8d] to-[#4DD4C5] bg-clip-text text-transparent">
                  We Offer
                </span>
              </h2>

              <div className="mb-5 h-0.5 w-12 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#4DD4C5]" />

              <p className="max-w-2xl text-base leading-relaxed text-slate-500" style={{ fontFamily: "var(--font-sans)" }}>
                At Dentglitz, we are committed to delivering high-quality, patient-centered dental care through advanced technology, clinical expertise and a compassionate approach — designed to meet the oral health needs of children, adults and seniors.
              </p>
            </div>

            <BookAppointmentButton
              label={
                <span className="flex items-center gap-1.5">
                  Book a Consultation
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#1e9b8d]/30 bg-[#1e9b8d]/8">
                    <LuArrowRight className="h-3 w-3" />
                  </span>
                </span>
              }
              className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e9b8d] transition-colors hover:text-[#0f7268]"
            />
          </div>

          {/* ── Service Cards Grid ── */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const { icon: Icon, title, desc, iconBg, iconBorder, iconColor, barGradient } = service;
              return (
                <div
                  key={title}
                  onClick={() => openModal(service)}
                  className="reveal-zoom group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-6
                             shadow-[0_1px_2px_rgba(0,0,0,0.03),_0_4px_12px_rgba(0,0,0,0.05),_0_16px_32px_rgba(30,155,141,0.04)]
                             transition-all duration-300
                             hover:-translate-y-2
                             hover:border-[#1e9b8d]/20
                             hover:shadow-[0_2px_4px_rgba(0,0,0,0.03),_0_12px_32px_rgba(0,0,0,0.08),_0_32px_56px_rgba(30,155,141,0.15)]
                             cursor-pointer"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  {/* Top gradient accent bar */}
                  {/* <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${barGradient} opacity-80 transition-opacity duration-300 group-hover:opacity-100`} /> */}

                  {/* Icon */}
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border ${iconBorder} ${iconBg}
                                shadow-[0_2px_8px_rgba(0,0,0,0.06)]
                                transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_4px_16px_rgba(30,155,141,0.18)]`}
                  >
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>

                  {/* Title */}
                  <h3
                    className="mb-2 text-[15px] font-extrabold leading-tight text-[#071224] transition-colors duration-300 group-hover:text-[#1e9b8d]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {title}
                  </h3>

                  {/* Description */}
                  <p
                    className="flex-1 text-[12.5px] leading-relaxed text-slate-500 group-hover:text-slate-600 transition-colors duration-300"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {desc}
                  </p>

                  {/* Learn More — always visible */}
                  <button
                    onClick={(e) => { e.stopPropagation(); openModal(service); }}
                    className="mt-4 flex w-fit items-center gap-1.5 rounded-full border border-[#1e9b8d]/25 bg-[#1e9b8d]/6 px-3.5 py-1.5 text-[11px] font-bold text-[#1e9b8d] transition-all duration-200 hover:bg-[#1e9b8d] hover:text-white hover:border-transparent hover:shadow-[0_4px_14px_rgba(30,155,141,0.35)]"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    Learn More <LuArrowRight className="h-3 w-3" />
                  </button>

                  {/* Inner hover glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1e9b8d]/0 to-[#4DD4C5]/0 transition-all duration-300 group-hover:from-[#1e9b8d]/[0.02] group-hover:to-[#4DD4C5]/[0.03] pointer-events-none" />
                </div>
              );
            })}
          </div>

          {/* ── Bottom CTA ── */}
          <div className="reveal mt-14 text-center">
            <BookAppointmentButton
              label={
                <span className="flex items-center gap-2.5">
                  Book a Consultation
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                    <LuArrowRight className="h-3.5 w-3.5" />
                  </span>
                </span>
              }
              className="transform-gpu inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] px-7 py-3.5 text-sm font-bold text-white
                         shadow-[0_4px_12px_rgba(0,0,0,0.1),_0_8px_28px_rgba(30,155,141,0.40)]
                         transition-all duration-300
                         hover:from-[#25b8a8] hover:to-[#344f8c]
                         hover:shadow-[0_6px_16px_rgba(0,0,0,0.12),_0_16px_48px_rgba(30,155,141,0.55)]
                         hover:-translate-y-0.5"
            />
          </div>
        </div>
      </section>

      {/* ── Service Detail Modal ── */}
      {selected && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-[#071224]/75 backdrop-blur-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
          />

          {/* Panel */}
          <div
            className={`relative w-full max-w-lg max-h-[88vh] flex flex-col overflow-hidden rounded-3xl bg-white
                       shadow-[0_8px_16px_rgba(0,0,0,0.08),_0_32px_80px_rgba(0,0,0,0.25),_0_0_0_1px_rgba(255,255,255,0.08)]
                       transition-all duration-300
                       ${visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-6"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient bar */}
            <div className={`h-1 w-full flex-shrink-0 bg-gradient-to-r ${selected.barGradient}`} />

            {/* Header */}
            <div className="flex items-start gap-4 px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${selected.iconBorder} ${selected.iconBg}
                            shadow-[0_2px_8px_rgba(0,0,0,0.06)]`}
              >
                <selected.icon className={`h-5 w-5 ${selected.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="text-[17px] font-extrabold leading-tight text-[#071224]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {selected.title}
                </h3>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#1e9b8d]">
                  Dentglitz – The Complete Dental Care
                </p>
              </div>
              <button
                onClick={closeModal}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600"
              >
                <LuX className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-6 py-5">
              {/* Intro */}
              <p
                className="mb-5 text-sm leading-relaxed text-slate-600"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {selected.detailIntro}
              </p>

              {/* Treatment list */}
              <ul className="space-y-2.5">
                {selected.details.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${selected.checkBg}`}>
                      <LuCheck className={`h-3 w-3 ${selected.checkColor} font-bold`} />
                    </span>
                    <span
                      className="text-[13.5px] leading-snug text-slate-700 font-medium"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer CTA */}
            <div className="flex-shrink-0 border-t border-slate-100 px-6 py-4 bg-slate-50/60">
              <BookAppointmentButton
                label={
                  <span className="flex items-center gap-2.5">
                    <LuCalendar className="h-4 w-4" />
                    Book an Appointment
                  </span>
                }
                className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] py-3 text-sm font-bold text-white
                           shadow-[0_4px_16px_rgba(30,155,141,0.35)]
                           transition-all duration-300 hover:from-[#25b8a8] hover:to-[#344f8c] hover:shadow-[0_6px_24px_rgba(30,155,141,0.50)]"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
