"use client";

import { useEffect, useRef, useState } from "react";
import {
  LuArrowRight, LuUsers, LuShieldCheck, LuSmile, LuCpu,
  LuHeart, LuStar, LuMapPin, LuCalendar,
} from "react-icons/lu";
import { FaTooth, FaAward, FaUserMd } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { BookAppointmentButton } from "@/components/booking/BookAppointmentButton";
import { media } from "@/config/media";
import { clinicStats, clinicValues, milestones, type ValueIconKey } from "@/config/clinic.data";

/* ── Counter hook ── */
function useCounter(target: number, active: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function StatCol({ target, suffix, label, sub, icon: Icon }: {
  target: number; suffix: string; label: string; sub: string; icon: React.ElementType;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCounter(target, active);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="group flex items-start gap-2 px-3 py-4 transition-all duration-300 hover:bg-white/40 sm:gap-4 sm:px-6 sm:py-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#1e9b8d]/30 bg-white/70 shadow-sm transition-all duration-300 group-hover:border-[#1e9b8d]/60 group-hover:bg-white sm:h-14 sm:w-14">
        <Icon className="h-4 w-4 text-[#1e9b8d] sm:h-6 sm:w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-extrabold leading-none text-[#1e9b8d] sm:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
          {count.toLocaleString()}{suffix}
        </p>
        <p className="mt-0.5 text-[10px] font-bold leading-tight text-[#071224] sm:text-sm">{label}</p>
        <p className="hidden text-[11px] text-slate-400 sm:block">{sub}</p>
      </div>
    </div>
  );
}

const stats = [
  { target: clinicStats.yearsOfExperience,   suffix: "+",  label: "Years of Experience",  sub: "Our doctors' clinical expertise", icon: FaAward },
  { target: clinicStats.yearsInService,       suffix: "+",  label: "Years of Service",     sub: "Serving Porur since 2022",        icon: FaCalendarAlt },
  { target: clinicStats.doctorsCount,         suffix: "+",  label: "Specialized Doctors",  sub: "Experienced professionals",       icon: FaUserMd },
  { target: clinicStats.happyPatients,        suffix: "+",  label: "Happy Patients",       sub: "Smiles transformed with care",    icon: LuUsers },
  { target: clinicStats.satisfactionPercent,  suffix: "%",  label: "Patient Satisfaction", sub: "Your trust is our success",       icon: LuShieldCheck },
];

const valueIconMap: Record<ValueIconKey, React.ElementType> = {
  heart:  LuHeart,
  cpu:    LuCpu,
  shield: LuShieldCheck,
  smile:  LuSmile,
  users:  LuUsers,
  star:   LuStar,
};

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    pageRef.current?.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-zoom").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={pageRef}>
      <Navbar lightText />

      {/* ── Hero banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#071224] via-[#0d1f3c] to-[#0a2420] pt-32 pb-20 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(30,155,141,0.18)_0%,transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_30%,rgba(42,72,126,0.2)_0%,transparent_55%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#4DD4C5]/25 bg-[#4DD4C5]/10 px-4 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#4DD4C5]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#4DD4C5]">Our Story</span>
            </div>
            <h1
              className="mb-5 text-4xl font-extrabold leading-[1.1] text-white lg:text-5xl xl:text-6xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              About{" "}
              <span className="bg-gradient-to-r from-[#4DD4C5] to-[#1e9b8d] bg-clip-text text-transparent">
                Dentglitz
              </span>
            </h1>
            <p className="text-lg leading-relaxed text-white/60">
              Serving the Porur community since 2021 — delivering advanced dental care with warmth, precision, and a genuine commitment to your smile.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookAppointmentButton
                label={<><FaCalendarAlt className="h-4 w-4" /> Book Appointment</>}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(30,155,141,0.4)] transition-all hover:scale-[1.03]"
                trackingId="about_hero"
              />
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15"
              >
                <LuMapPin className="h-4 w-4" /> Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content on fixed bg ── */}
      <div
        className="bg-parallax"
        style={{
          backgroundImage: `url(${media.aboutBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        {/* ── Our Story ── */}
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />
          <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#4DD4C5]/12 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#2a487e]/10 blur-[120px]" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

              {/* Image */}
              <div className="reveal-left relative pb-6 lg:pb-0">
                <div className="relative overflow-hidden rounded-[28px] shadow-[0_24px_80px_rgba(30,155,141,0.15),0_8px_32px_rgba(0,0,0,0.12)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={media.whyUs}
                    alt="Dentglitz Clinic"
                    className="h-[360px] w-full object-cover object-center lg:h-[500px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071224]/30 via-transparent to-transparent" />
                </div>
                <div className="animate-float-sm absolute -bottom-5 left-6 flex items-center gap-3 rounded-2xl bg-white px-5 py-3.5 shadow-[0_12px_40px_rgba(30,155,141,0.18)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#1e9b8d]/30 bg-[#1e9b8d]/8">
                    <FaTooth className="h-5 w-5 text-[#1e9b8d]" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold leading-none text-[#071224]" style={{ fontFamily: "var(--font-heading)" }}>{clinicStats.yearsOfExperience}+</p>
                    <p className="text-xs font-semibold text-slate-400">Years of Excellence</p>
                  </div>
                </div>
                <div className="pointer-events-none absolute -inset-3 rounded-[36px] border border-[#4DD4C5]/15" />
              </div>

              {/* Text */}
              <div className="reveal-right">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1e9b8d]/30 bg-[#1e9b8d]/8 px-4 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#1e9b8d]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1e9b8d]">About Dentglitz</span>
                </div>
                <h2
                  className="mb-3 text-2xl font-extrabold leading-[1.12] text-[#071224] sm:text-3xl lg:text-4xl xl:text-[2.75rem]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Delivering Exceptional{" "}
                  <span className="bg-gradient-to-r from-[#1e9b8d] to-[#4DD4C5] bg-clip-text text-transparent">
                    Dental Care
                  </span>{" "}
                  with Heart
                </h2>
                <div className="mb-5 h-0.5 w-12 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#4DD4C5]" />
                <div className="space-y-4 text-base leading-relaxed text-slate-500">
                  <p>
                    At Dentglitz, we believe every smile tells a story. Founded in 2021 by Dr. J.Chimera, our clinic
                    was built on a simple promise: exceptional dental care delivered with genuine warmth, in an environment
                    where patients feel truly at ease.
                  </p>
                  <p>
                    Over the years, we&apos;ve grown from a single-chair practice to a full-service dental centre — but our
                    philosophy has never changed. Each treatment plan is tailored to the individual, balancing clinical
                    excellence with an honest, patient-first approach.
                  </p>
                  <p>
                    Located in the heart of Porur, Chennai, we serve families, professionals, and patients of all ages
                    across the western suburbs. Whether you need a routine check-up or a complete smile makeover, our
                    team is here for every step of your journey.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <LuMapPin className="h-4 w-4 text-[#1e9b8d]" />
                    Porur, Chennai
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats strip ── */}
        <section className="relative py-10">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="reveal overflow-hidden rounded-[24px] border border-white/70 bg-white/60 shadow-[0_8px_40px_rgba(30,155,141,0.08)] backdrop-blur-xl">
              <div className="grid grid-cols-2 divide-x divide-y divide-slate-100/80 lg:grid-cols-5 lg:divide-y-0">
                {stats.map((s) => <StatCol key={s.label} {...s} />)}
              </div>
            </div>
          </div>
        </section>

        {/* ── Our Journey (Timeline) ── */}
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />
          <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#2a487e]/10 blur-[120px]" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="reveal mb-14 text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#2a487e]/30 bg-[#2a487e]/8 px-4 py-1.5">
                <span className="h-2 w-2 rounded-full bg-[#2a487e]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2a487e]">Our Journey</span>
              </div>
              <h2
                className="text-2xl font-extrabold leading-[1.12] text-[#071224] sm:text-3xl lg:text-4xl xl:text-[2.75rem]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                A Journey of{" "}
                <span className="bg-gradient-to-r from-[#2a487e] to-[#1e9b8d] bg-clip-text text-transparent">
                  Growing Smiles
                </span>
              </h2>
            </div>

            <div className="relative mx-auto max-w-3xl">
              {/* Vertical line — left-aligned on mobile, centred on lg */}
              <div className="absolute left-[17px] top-0 h-full w-0.5 bg-gradient-to-b from-[#1e9b8d]/40 via-[#2a487e]/30 to-transparent lg:left-1/2 lg:-translate-x-px" />

              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`reveal relative mb-8 pl-10 lg:mb-10 lg:flex lg:items-start lg:gap-6 lg:pl-0 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                >
                  {/* Dot on left line — mobile only */}
                  <div className="absolute left-[11px] top-5 h-3.5 w-3.5 rounded-full border-2 border-[#1e9b8d] bg-white shadow-[0_0_0_3px_rgba(30,155,141,0.15)] lg:hidden" />

                  {/* Card */}
                  <div className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.07)] backdrop-blur-sm lg:w-[calc(50%-2rem)]">
                    <span className="mb-2 inline-block rounded-full border border-[#1e9b8d]/25 bg-[#1e9b8d]/8 px-3 py-1 text-xs font-bold text-[#1e9b8d]">
                      {m.year}
                    </span>
                    <h3 className="mb-1 text-base font-bold text-[#071224]">{m.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-500">{m.desc}</p>
                  </div>

                  {/* Centre dot — desktop only */}
                  <div className="relative hidden shrink-0 items-center justify-center lg:flex">
                    <div className="h-4 w-4 rounded-full border-2 border-[#1e9b8d] bg-white shadow-[0_0_0_4px_rgba(30,155,141,0.15)]" />
                  </div>

                  {/* Spacer — desktop only */}
                  <div className="hidden lg:block lg:w-[calc(50%-2rem)]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Our Values ── */}
        <section className="relative overflow-hidden py-20 lg:py-28">
          <div className="absolute inset-0 bg-white/65 backdrop-blur-[2px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#4DD4C5]/12 blur-[120px]" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="reveal mb-14 text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1e9b8d]/30 bg-[#1e9b8d]/8 px-4 py-1.5">
                <span className="h-2 w-2 rounded-full bg-[#1e9b8d]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1e9b8d]">What We Stand For</span>
              </div>
              <h2
                className="text-2xl font-extrabold leading-[1.12] text-[#071224] sm:text-3xl lg:text-4xl xl:text-[2.75rem]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Our Core{" "}
                <span className="bg-gradient-to-r from-[#1e9b8d] to-[#4DD4C5] bg-clip-text text-transparent">Values</span>
              </h2>
              <div className="mx-auto mt-3 h-0.5 w-12 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#4DD4C5]" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {clinicValues.map(({ iconKey, title, desc }, i) => {
                const Icon = valueIconMap[iconKey];
                return (
                  <div
                    key={title}
                    className="reveal-zoom group flex gap-4 rounded-2xl border border-white/80 bg-white/75 p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#4DD4C5]/30 hover:shadow-[0_12px_40px_rgba(30,155,141,0.1)]"
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#1e9b8d]/20 bg-[#1e9b8d]/8 transition-all group-hover:bg-[#1e9b8d]/15">
                      <Icon className="h-5 w-5 text-[#1e9b8d]" />
                    </div>
                    <div>
                      <h3 className="mb-1.5 text-sm font-bold text-[#071224]">{title}</h3>
                      <p className="text-[13px] leading-relaxed text-slate-500">{desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative overflow-hidden py-16">
          <div className="absolute inset-0 bg-gradient-to-br from-[#071224] via-[#0d1f3c] to-[#0a2420]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(30,155,141,0.2)_0%,transparent_70%)]" />
          <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
            <h2
              className="mb-4 text-3xl font-extrabold text-white lg:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ready to{" "}
              <span className="bg-gradient-to-r from-[#4DD4C5] to-[#1e9b8d] bg-clip-text text-transparent">
                Transform Your Smile?
              </span>
            </h2>
            <p className="mb-8 text-white/60">
              Book a consultation today and take the first step towards the smile you deserve.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <BookAppointmentButton
                label={<><FaCalendarAlt className="h-4 w-4" /> Book Appointment</>}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(30,155,141,0.4)] transition-all hover:scale-[1.03]"
                trackingId="about_cta"
              />
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15"
              >
                Contact Us <LuArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
