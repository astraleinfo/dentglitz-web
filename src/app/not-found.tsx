"use client";

import Link from "next/link";
import { LuArrowLeft, LuHouse, LuSearch } from "react-icons/lu";
import { FaTooth, FaCalendarAlt } from "react-icons/fa";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { BookAppointmentButton } from "@/components/booking/BookAppointmentButton";

export default function NotFound() {
  return (
    <div>
      <Navbar lightText />

      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#071224] via-[#0d1f3c] to-[#0a2420] flex flex-col items-center justify-center px-6 text-center">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(30,155,141,0.18)_0%,transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_60%,rgba(42,72,126,0.2)_0%,transparent_55%)]" />

        {/* Glowing particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-[#4DD4C5]"
              style={{
                width:  i % 3 === 0 ? "6px" : i % 3 === 1 ? "4px" : "3px",
                height: i % 3 === 0 ? "6px" : i % 3 === 1 ? "4px" : "3px",
                left: `${5 + i * 5.2}%`,
                top:  `${10 + (i % 6) * 14}%`,
                opacity: 0.55,
                boxShadow: i % 3 === 0
                  ? "0 0 8px 3px rgba(77,212,197,0.7)"
                  : "0 0 6px 2px rgba(77,212,197,0.55)",
                animation: `particle-float ${4 + (i % 4)}s ease-in-out infinite`,
                animationDelay: `${i * 0.35}s`,
              }}
            />
          ))}
        </div>

        {/* Floating tooth icon */}
        <div className="relative z-10 mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-[#4DD4C5]/20 bg-[#4DD4C5]/10 animate-float">
          <FaTooth className="h-12 w-12 text-[#4DD4C5]" />
        </div>

        {/* 404 */}
        <div className="relative z-10 mb-4">
          <p className="text-[9rem] font-extrabold leading-none tracking-tight bg-gradient-to-r from-[#4DD4C5] via-[#1e9b8d] to-[#2a487e] bg-clip-text text-transparent sm:text-[12rem]"
            style={{ fontFamily: "var(--font-heading)" }}>
            404
          </p>
        </div>

        {/* Badge */}
        <div className="relative z-10 mb-5 inline-flex items-center gap-2 rounded-full border border-[#4DD4C5]/25 bg-[#4DD4C5]/10 px-4 py-1.5">
          <LuSearch className="h-3.5 w-3.5 text-[#4DD4C5]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#4DD4C5]">Page Not Found</span>
        </div>

        <h1
          className="relative z-10 mb-4 max-w-xl text-3xl font-extrabold leading-[1.15] text-white sm:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          This page seems to have{" "}
          <span className="bg-gradient-to-r from-[#4DD4C5] to-[#1e9b8d] bg-clip-text text-transparent">
            gone missing
          </span>
        </h1>

        <p className="relative z-10 mb-10 max-w-md text-base leading-relaxed text-white/55">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get you back to your smile journey.
        </p>

        {/* CTAs */}
        <div className="relative z-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(30,155,141,0.4)] transition-all hover:scale-[1.03]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <LuHouse className="h-4 w-4" /> Back to Home
          </Link>
          <BookAppointmentButton
            label={<><FaCalendarAlt className="h-4 w-4" /> Book Appointment</>}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15"
            trackingId="404_page"
          />
        </div>

        {/* Quick links */}
        <div className="relative z-10 mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {[
            { href: "/about", label: "About Us" },
            { href: "/#services", label: "Treatments" },
            { href: "/#doctors", label: "Our Doctors" },
            { href: "/#contact", label: "Contact" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-[#4DD4C5]"
            >
              <LuArrowLeft className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
