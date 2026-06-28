"use client";

import { useEffect, useRef } from "react";
import { LuArrowRight } from "react-icons/lu";
import { FaCalendarAlt } from "react-icons/fa";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { BeforeAfterSlider } from "@/components/landing/Transformations";
import { BookAppointmentButton } from "@/components/booking/BookAppointmentButton";
import { media } from "@/config/media";

const cases = media.transformations;

export default function TransformationsPage() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.05 }
    );
    sectionRef.current?.querySelectorAll(".reveal, .reveal-zoom").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div>
      <Navbar lightText />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#071224] via-[#0d1f3c] to-[#0a2420] pt-32 pb-14 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(30,155,141,0.18)_0%,transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_30%,rgba(42,72,126,0.2)_0%,transparent_55%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#4DD4C5]/25 bg-[#4DD4C5]/10 px-4 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#4DD4C5]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#4DD4C5]">Smile Transformations</span>
          </div>
          <h1
            className="mb-4 text-3xl font-extrabold leading-[1.1] text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Real People.{" "}
            <span className="bg-gradient-to-r from-[#4DD4C5] to-[#1e9b8d] bg-clip-text text-transparent">
              Real Results.
            </span>
          </h1>
          <p className="max-w-xl text-base text-white/60 sm:text-lg">
            Drag the slider on each case to reveal the before and after. Every result is from a real patient treated at Dentglitz.
          </p>
          <p className="mt-3 text-sm text-white/35">{cases.length} transformation cases</p>
        </div>
      </section>

      {/* ── Cases ── */}
      <section
        ref={sectionRef}
        className="bg-parallax relative overflow-hidden py-12 sm:py-16 lg:py-20"
        style={{
          backgroundImage: `url(${media.aboutBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/72 backdrop-blur-[2px]" />
        <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#4DD4C5]/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#2a487e]/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4 sm:space-y-10 sm:px-6 lg:space-y-12 lg:px-8">
          {cases.map((c, i) => (
            <div
              key={c.id}
              className="reveal-zoom overflow-hidden rounded-2xl border border-white/80 bg-white/85 shadow-[0_4px_32px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:rounded-3xl"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Case header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1e9b8d]/10 text-xs font-extrabold text-[#1e9b8d] sm:h-8 sm:w-8 sm:text-sm">
                    {i + 1}
                  </span>
                  <h2
                    className="text-sm font-bold text-[#071224] sm:text-base"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {c.label}
                  </h2>
                </div>
                <span className="shrink-0 rounded-full border border-[#1e9b8d]/25 bg-[#1e9b8d]/8 px-3 py-1 text-[11px] font-bold text-[#1e9b8d]">
                  {c.tag}
                </span>
              </div>

              {/* Slider */}
              <div className="p-3 sm:p-5 lg:p-6">
                <BeforeAfterSlider
                  before={c.before}
                  after={c.after}
                  heightClass="h-[220px] sm:h-[340px] lg:h-[460px]"
                />
                <p className="mt-2 text-center text-xs text-slate-400">
                  <span className="hidden sm:inline">← Drag slider to compare →</span>
                  <span className="sm:hidden">Touch &amp; drag to compare</span>
                </p>
              </div>

              {/* Quote */}
              <div className="border-t border-slate-100 bg-[#f4fffe] px-4 py-4 sm:px-6 sm:py-5">
                <div className="mb-2 text-2xl leading-none text-[#1e9b8d] sm:text-3xl">❝</div>
                <p className="text-sm leading-relaxed text-slate-600 italic">{c.quote}</p>
                <div className="mt-3 flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="bg-parallax relative overflow-hidden py-14 sm:py-16"
        style={{ backgroundImage: `url(${media.aboutBackground})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#071224]/95 to-[#0a2420]/95" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(30,155,141,0.2)_0%,transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center sm:px-6">
          <h2
            className="mb-4 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Ready for Your{" "}
            <span className="bg-gradient-to-r from-[#4DD4C5] to-[#1e9b8d] bg-clip-text text-transparent">
              Transformation?
            </span>
          </h2>
          <p className="mb-8 text-sm text-white/60 sm:text-base">
            Book a consultation and let our team create your personalised smile plan.
          </p>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <BookAppointmentButton
              label={
                <span className="flex items-center justify-center gap-2">
                  <FaCalendarAlt className="h-4 w-4" /> Book a Consultation
                </span>
              }
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] px-7 py-3.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(30,155,141,0.4)] transition-all hover:scale-[1.03] sm:w-auto"
            />
            <a
              href="/gallery"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/8 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/15 sm:w-auto"
            >
              View Gallery <LuArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <div
        className="bg-parallax"
        style={{ backgroundImage: `url(${media.aboutBackground})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <Footer />
      </div>
    </div>
  );
}
