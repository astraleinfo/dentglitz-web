"use client";

import Image from "next/image";
import { LuArrowRight } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import { SectionParticles } from "@/components/landing/AnimatedParticles";
import { useSiteConfig } from "@/components/ThemeProvider";
import { BookAppointmentButton } from "@/components/booking/BookAppointmentButton";
import { media } from "@/config/media";

export function CTA() {
  const cfg = useSiteConfig();

  return (
    <section id="cta" className="">
      <div className="">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#071224] via-[#0f2040] to-[#071224] pl-4 pr-8 py-6 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16">
          {/* Glow blobs — matching Hero */}
          <div className="pointer-events-none absolute -top-20 -left-20 h-[280px] w-[280px] rounded-full bg-[#1e9b8d]/10 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-[280px] w-[280px] rounded-full bg-[#2a487e]/15 blur-[80px]" />
          <div className="pointer-events-none absolute top-0 left-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-[#4DD4C5]/20 to-transparent" />

          <SectionParticles />

          <div className="relative z-10 flex flex-col items-center gap-8 lg:flex-row lg:items-center">

            {/* Tooth illustration */}
            <div className="hidden flex-shrink-0 items-center justify-center lg:flex lg:w-52 xl:w-60">
              <Image
                src={media.glowingTeeth}
                alt="Tooth"
                width={240}
                height={240}
                className="w-full animate-float"
                style={{ filter: "drop-shadow(0 0 20px rgba(77,212,197,0.75)) drop-shadow(0 0 40px rgba(30,155,141,0.45))" }}
              />
            </div>

            {/* Text block */}
            <div className="flex-1 text-center lg:text-left">
              {/* Mini badge */}
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#4DD4C5]/30 bg-[#4DD4C5]/8 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4DD4C5] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#4DD4C5]">
                  Start Your Smile Journey
                </span>
              </div>

              <h2
                className="text-2xl font-extrabold leading-tight text-white sm:text-3xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Ready for Your{" "}
                <span className="bg-gradient-to-r from-[#4DD4C5] to-[#1e9b8d] bg-clip-text text-transparent">
                  Perfect Smile?
                </span>
              </h2>

              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/55 mx-auto lg:mx-0" style={{ fontFamily: "var(--font-sans)" }}>
                Book today and take the first step towards a healthier, brighter smile at {cfg.clinicName}.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
              <BookAppointmentButton
                label={
                  <span className="flex items-center gap-2">
                    Book Appointment
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                      <LuArrowRight className="h-3 w-3" />
                    </span>
                  </span>
                }
                className="transform-gpu inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] px-6 py-3 text-sm font-bold text-white shadow-[0_4px_20px_rgba(30,155,141,0.40)] transition-all duration-300 hover:from-[#25b8a8] hover:to-[#344f8c] hover:shadow-[0_8px_32px_rgba(30,155,141,0.60)]"
                trackingId="cta_section"
              />
              <a
                href={`https://wa.me/${cfg.phone.replace(/\D/g, "")}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/8 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/35 hover:bg-white/15"
              >
                <FaWhatsapp className="h-4 w-4 text-[#25D366]" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
