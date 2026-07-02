"use client";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaTooth,
  FaHeart,
} from "react-icons/fa";
import {
  LuArrowRight,
  LuShieldCheck,
  LuUsers,
  LuSmile,
  LuCpu,
} from "react-icons/lu";

import { useSiteConfig } from "@/components/ThemeProvider";
import { socialLinks } from "@/config/clinic.data";
import { trackButtonClick } from "@/lib/gtm";

const quickLinks = [
  { label: "Home", href: "#top" },
  { label: "About Us", href: "#about" },
  { label: "Treatments", href: "#services" },
  { label: "Our Doctors", href: "#doctors" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact Us", href: "#contact" },
];

const services = [
  "General Dentistry",
  "Cosmetic Dentistry",
  "Dental Implants",
  "Orthodontics",
  "Root Canal Treatment",
  "Periodontal Care",
];


const features = [
  {
    icon: LuShieldCheck,
    title: "Advanced Technology",
    desc: "We use the latest technology for accurate diagnosis and effective treatments.",
  },
  {
    icon: LuUsers,
    title: "Expert Doctors",
    desc: "Our team of experienced specialists is dedicated to your oral health.",
  },
  {
    icon: LuSmile,
    title: "Patient Focused",
    desc: "Your comfort and satisfaction are our top priorities in every step.",
  },
  {
    icon: LuCpu,
    title: "Affordable Care",
    desc: "High-quality dental care that fits your budget without compromise.",
  },
];

export function Footer() {
  const cfg = useSiteConfig();

  return (
    <footer
      id="footer"
      className="relative overflow-hidden bg-gradient-to-b from-[#eaf6fb] to-white"
    >
      {/* Decorative curved SVG lines */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1440 620"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,120 C240,60 480,180 720,120 C960,60 1200,180 1440,120"
          stroke="#1e9b8d"
          strokeWidth="1.5"
          fill="none"
          opacity="0.12"
        />
        <path
          d="M0,240 C240,170 480,310 720,240 C960,170 1200,310 1440,240"
          stroke="#1e9b8d"
          strokeWidth="1.2"
          fill="none"
          opacity="0.09"
        />
        <path
          d="M0,370 C240,295 480,445 720,370 C960,295 1200,445 1440,370"
          stroke="#4DD4C5"
          strokeWidth="1"
          fill="none"
          opacity="0.08"
        />
        <path
          d="M0,490 C240,415 480,565 720,490 C960,415 1200,565 1440,490"
          stroke="#4DD4C5"
          strokeWidth="0.8"
          fill="none"
          opacity="0.06"
        />
      </svg>

      {/* Top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#4DD4C5]/70 to-transparent" />

      {/* ── Floating tooth medallion ── */}
      <div className="relative z-10 flex justify-center pt-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#1e9b8d]/20 bg-white shadow-[0_4px_28px_rgba(30,155,141,0.18)] ring-4 ring-[#4DD4C5]/10">
          <FaTooth className="h-7 w-7 text-[#1e9b8d]" />
        </div>
      </div>

      {/* ── Main footer grid ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-8 pb-4">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* ── Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#top" className="inline-flex items-center gap-2.5 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cfg.logoUrl}
                alt={cfg.clinicName}
                className="h-20 w-auto"
              />
              {/* <div>
                <p className="text-base font-extrabold leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                  <span className="text-[#071224]">Dent</span><span className="text-[#1e9b8d]">glitz</span>
                </p>
                <p className="text-[8px] uppercase tracking-widest text-[#1e9b8d] font-bold mt-0.5">The Complete Dental Care</p>
              </div> */}
            </a>

            <div className="mb-4 h-0.5 w-10 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#4DD4C5]" />

            <p
              className="text-sm text-slate-500 leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              At {cfg.clinicName}, we combine advanced technology, skilled
              specialists, and compassionate care to create healthy, beautiful
              smiles that last a lifetime.
            </p>

            <div className="flex gap-2 mb-8">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  onClick={() => trackButtonClick(`footer_social_${label.toLowerCase().replace(/\s+/g, "_")}`)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1e9b8d]/25 bg-white text-[#1e9b8d] shadow-sm transition-all duration-300 hover:border-[#1e9b8d] hover:bg-[#1e9b8d] hover:text-white hover:scale-110 hover:shadow-[0_4px_16px_rgba(30,155,141,0.3)]"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>

            {/* 3D tooth illustration */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* <img
              src="/glowing-teeth.png"
              alt=""
              className="h-28 w-auto opacity-75 animate-float"
            /> */}
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#071224]">
              Quick Links
            </h4>
            <div className="mb-5 h-0.5 w-8 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#4DD4C5]" />
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={() => trackButtonClick(`footer_quicklink_${label.toLowerCase().replace(/\s+/g, "_")}`)}
                    className="group flex items-center gap-2 text-sm text-slate-500 transition-all duration-200 hover:text-[#1e9b8d]"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    <LuArrowRight className="h-3.5 w-3.5 text-[#1e9b8d] transition-transform duration-200 group-hover:translate-x-0.5" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Services ── */}
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#071224]">
              Our Services
            </h4>
            <div className="mb-5 h-0.5 w-8 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#4DD4C5]" />
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    onClick={() => trackButtonClick(`footer_service_${s.toLowerCase().replace(/\s+/g, "_")}`)}
                    className="group flex items-center gap-2.5 text-sm text-slate-500 transition-all duration-200 hover:text-[#1e9b8d]"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    <LuArrowRight className="h-3.5 w-3.5 text-[#1e9b8d] transition-transform duration-200 group-hover:translate-x-0.5" />
                    {/* <FaTooth className="h-3.5 w-3.5 shrink-0 text-[#4DD4C5]/70 group-hover:text-[#1e9b8d] transition-colors" /> */}
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#071224]">
              Contact Us
            </h4>
            <div className="mb-5 h-0.5 w-8 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#4DD4C5]" />
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#1e9b8d]/20 bg-white shadow-sm">
                  <FaPhoneAlt className="h-3.5 w-3.5 text-[#1e9b8d]" />
                </div>
                <a
                  href={`tel:${cfg.phone}`}
                  onClick={() => trackButtonClick("footer_call")}
                  className="text-sm text-slate-600 hover:text-[#1e9b8d] transition-colors"
                >
                  {cfg.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#1e9b8d]/20 bg-white shadow-sm">
                  <FaEnvelope className="h-3.5 w-3.5 text-[#1e9b8d]" />
                </div>
                <a
                  href={`mailto:${cfg.email}`}
                  onClick={() => trackButtonClick("footer_email")}
                  className="text-sm text-slate-600 hover:text-[#1e9b8d] transition-colors truncate"
                >
                  {cfg.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#1e9b8d]/20 bg-white shadow-sm">
                  <FaMapMarkerAlt className="h-3.5 w-3.5 text-[#1e9b8d]" />
                </div>
                <span className="text-sm text-slate-600 leading-relaxed">
                  {cfg.address}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#1e9b8d]/20 bg-white shadow-sm">
                  <FaClock className="h-3.5 w-3.5 text-[#1e9b8d]" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">
                    Mon - Sat: {cfg.workingHours.start} - {cfg.workingHours.end}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sunday: Closed
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gradient divider */}
      <div className="relative z-10 mx-4 h-px bg-gradient-to-r from-transparent via-[#1e9b8d]/20 to-transparent" />

      {/* ── Features strip ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-[#1e9b8d]/12 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-[#1e9b8d]/30 hover:shadow-[0_6px_24px_rgba(30,155,141,0.1)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#1e9b8d]/20 bg-[#eaf6fb]">
                <Icon className="h-5 w-5 text-[#1e9b8d]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#071224] mb-1">{title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient divider */}
      <div className="relative z-10 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* ── Bottom bar ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 py-5 text-xs text-slate-400">
          <p style={{ fontFamily: "var(--font-sans)" }}>
            © {new Date().getFullYear()} {cfg.clinicName}. All Rights Reserved.
          </p>
          <p
            className="flex items-center gap-1.5"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Designed with <FaHeart className="h-3 w-3 text-[#1e9b8d]" /> by{" "}
            <a
              href="https://astraleinfo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#1e9b8d] transition-colors hover:text-[#4DD4C5]"
            >
              Astrale
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
