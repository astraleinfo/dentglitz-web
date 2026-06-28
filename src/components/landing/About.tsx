"use client";

import { useEffect, useRef, useState } from "react";
import { LuArrowRight, LuUsers, LuShieldCheck, LuSmile, LuCpu } from "react-icons/lu";
import { FaTooth, FaAward, FaUserMd } from "react-icons/fa";
import { media } from "@/config/media";
import { clinicStats } from "@/config/clinic.data";

const stats = [
  { target: clinicStats.yearsOfExperience,    suffix: "+", label: "Years of Experience",  sub: "Trusted dental care since 2009", icon: FaAward },
  { target: clinicStats.doctorsCount,          suffix: "+", label: "Specialized Doctors",  sub: "Experienced professionals",      icon: FaUserMd },
  { target: clinicStats.happyPatients,         suffix: "+", label: "Happy Patients",       sub: "Smiles transformed with care",   icon: LuUsers },
  { target: clinicStats.satisfactionPercent,   suffix: "%", label: "Patient Satisfaction", sub: "Your trust is our success",      icon: LuShieldCheck },
];

const features = [
  { icon: LuUsers,       title: "Expert Dental Team",      desc: "Highly qualified and experienced specialists dedicated to your care." },
  { icon: LuCpu,         title: "Advanced Technology",     desc: "We use the latest technology for accurate diagnosis and treatment." },
  { icon: LuShieldCheck, title: "Patient-Centered Care",   desc: "Your comfort and satisfaction are our top priorities." },
  { icon: LuSmile,       title: "Comprehensive Services",  desc: "From preventive care to advanced treatments, we do it all." },
];

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
    <div ref={ref} className="group flex items-center gap-2 px-3 py-4 transition-all duration-300 hover:bg-white/40 sm:gap-4 sm:px-6 sm:py-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#1e9b8d]/30 bg-white/70 shadow-sm transition-all duration-300 group-hover:border-[#1e9b8d]/60 group-hover:bg-white sm:h-14 sm:w-14">
        <Icon className="h-4 w-4 text-[#1e9b8d] sm:h-6 sm:w-6" />
      </div>
      <div>
        <p className="text-lg font-extrabold leading-none text-[#1e9b8d] sm:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>
          {count.toLocaleString()}{suffix}
        </p>
        <p className="mt-0.5 text-[10px] font-bold text-[#071224] sm:text-sm">{label}</p>
        <p className="text-[10px] text-slate-400">{sub}</p>
      </div>
    </div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    sectionRef.current
      ?.querySelectorAll(".reveal, .reveal-left, .reveal-right")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden scroll-mt-28 py-20 lg:py-28"
    >
      {/* Light overlay so text stays readable over fixed page background */}
      <div className="absolute inset-0 bg-white/55 backdrop-blur-[2px]" />

      {/* Soft teal glow top-left */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#4DD4C5]/12 blur-[120px]" />
      {/* Soft blue glow bottom-right */}
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#2a487e]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

        {/* ══════════════════════════════════════
            Row 1 — Image left · Content right
        ══════════════════════════════════════ */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* ─── LEFT: Image ─── */}
          <div className="reveal-left relative pb-6 lg:pb-0">

            {/* Image card */}
            <div className="relative overflow-hidden rounded-[28px] shadow-[0_24px_80px_rgba(30,155,141,0.15),0_8px_32px_rgba(0,0,0,0.12)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={media.whyUs}
                alt="Dentglitz Clinic"
                className="h-[240px] w-full object-cover object-center sm:h-[360px] lg:h-[460px] xl:h-[520px]"
              />
              {/* Subtle inner gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071224]/30 via-transparent to-transparent" />
            </div>

            {/* Floating badge — bottom left */}
            <div className="animate-float-sm absolute -bottom-5 left-6 flex items-center gap-3 rounded-2xl bg-white px-5 py-3.5 shadow-[0_12px_40px_rgba(30,155,141,0.18),0_4px_16px_rgba(0,0,0,0.08)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#1e9b8d]/30 bg-[#1e9b8d]/8">
                <FaTooth className="h-5 w-5 text-[#1e9b8d]" />
              </div>
              <div>
                <p className="text-2xl font-extrabold leading-none text-[#071224]" style={{ fontFamily: "var(--font-heading)" }}>
                  {clinicStats.yearsOfExperience}+
                </p>
                <p className="text-xs font-semibold text-slate-400">Years of Excellence</p>
              </div>
            </div>

            {/* Decorative ring */}
            <div className="pointer-events-none absolute -inset-3 rounded-[36px] border border-[#4DD4C5]/15" />
          </div>

          {/* ─── RIGHT: Content ─── */}
          <div className="reveal-right">

            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1e9b8d]/30 bg-[#1e9b8d]/8 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#1e9b8d]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1e9b8d]">
                About Dentglitz
              </span>
            </div>

            {/* Heading */}
            <h2
              className="mb-3 text-[1.65rem] font-extrabold leading-[1.12] text-[#071224] sm:text-4xl xl:text-[2.75rem]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Delivering Exceptional{" "}
              <span className="bg-gradient-to-r from-[#1e9b8d] to-[#4DD4C5] bg-clip-text text-transparent">
                Dental Care
              </span>{" "}
              with Heart
            </h2>

            {/* Teal accent line */}
            <div className="mb-5 h-0.5 w-12 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#4DD4C5]" />

            {/* Description */}
            <p className="mb-7 text-base leading-relaxed text-slate-500" style={{ fontFamily: "var(--font-sans)" }}>
              At Dentglitz, we believe every smile tells a story. Our mission is to
              provide advanced dental care in a comfortable and friendly environment.
              With a team of experienced specialists and state-of-the-art technology,
              we ensure the best possible care for you and your family.
            </p>

            {/* Feature cards 2×2 */}
            <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="group flex gap-3.5 rounded-2xl border border-slate-100/80 bg-white/70 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4DD4C5]/30 hover:bg-white hover:shadow-[0_8px_24px_rgba(30,155,141,0.1)]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#1e9b8d]/20 bg-[#1e9b8d]/8 transition-all duration-300 group-hover:bg-[#1e9b8d]/15">
                    <Icon className="h-4 w-4 text-[#1e9b8d]" />
                  </div>
                  <div>
                    <p className="mb-0.5 text-sm font-bold text-[#071224]">{title}</p>
                    <p className="text-[12px] leading-relaxed text-slate-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="/about"
              className="transform-gpu inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] px-7 py-3.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(30,155,141,0.35)] transition-all duration-300 hover:from-[#25b8a8] hover:to-[#344f8c] hover:shadow-[0_8px_32px_rgba(30,155,141,0.55)]"
            >
              Learn More About Us
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                <LuArrowRight className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>
        </div>

        {/* ══════════════════════════════════════
            Row 2 — Stats strip
        ══════════════════════════════════════ */}
        <div className="reveal mt-16">
          <div className="overflow-hidden rounded-[24px] border border-white/70 bg-white/60 shadow-[0_8px_40px_rgba(30,155,141,0.08),0_2px_12px_rgba(0,0,0,0.06)] backdrop-blur-xl">
            <div className="grid grid-cols-2 divide-x divide-y divide-slate-100/80 lg:grid-cols-4 lg:divide-y-0">
              {stats.map((s) => (
                <StatCol key={s.label} {...s} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
