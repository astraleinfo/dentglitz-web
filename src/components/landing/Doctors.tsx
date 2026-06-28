"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  LuLinkedin, LuInstagram, LuMail, LuPhone, LuX, LuCheck,
  LuCalendar, LuBriefcase, LuBadgeCheck,
} from "react-icons/lu";
import { doctors, type Doctor } from "@/config/clinic.data";
import { BookAppointmentButton } from "@/components/booking/BookAppointmentButton";

export function Doctors() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [visible, setVisible] = useState(false);

  const openModal = useCallback((doc: Doctor) => {
    setSelected(doc);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const closeModal = useCallback(() => {
    setVisible(false);
    setTimeout(() => setSelected(null), 300);
  }, []);

  useEffect(() => {
    if (!selected) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selected, closeModal]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    sectionRef.current?.querySelectorAll(".reveal, .reveal-zoom").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <section ref={sectionRef} id="doctors" className="relative overflow-hidden scroll-mt-28 py-24">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px]" />
        <div className="pointer-events-none absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

          {/* Header */}
          <div className="reveal mb-16 text-center">
            <div className="section-badge mb-5 inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Our Specialists</span>
            </div>
            <h2 className="section-heading">
              Meet Our{" "}
              <span className="text-brand-gradient">Expert Doctors</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500" style={{ fontFamily: "var(--font-sans)" }}>
              Experienced and dedicated dental specialists committed to delivering exceptional care at Dentglitz – The Complete Dental Care.
            </p>
          </div>

          {/* Doctor cards */}
          <div className="grid gap-8 sm:grid-cols-2 max-w-3xl mx-auto">
            {doctors.map((doc, i) => (
              <div
                key={doc.name}
                onClick={() => openModal(doc)}
                className="reveal-zoom group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm cursor-pointer transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)] hover:border-primary/20"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Photo */}
                <div className="relative overflow-hidden" style={{ height: 260 }}>
                  <Image
                    src={doc.avatar}
                    alt={doc.name}
                    fill
                    className="object-cover object-top transition-transform duration-600 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

                  {/* Social icons on hover */}
                  <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2.5 translate-y-6 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                    {[
                      { Icon: LuLinkedin,  label: "LinkedIn" },
                      { Icon: LuInstagram, label: "Instagram" },
                      { Icon: LuMail,      label: "Email" },
                    ].map(({ Icon, label }) => (
                      <a
                        key={label}
                        href="#"
                        aria-label={label}
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/40 hover:scale-110"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>

                  {/* Specialty badge */}
                  <div className="absolute top-3 left-3 rounded-full bg-primary/90 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                    {doc.specialty}
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-secondary transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                      {doc.name}
                    </h3>
                    {doc.regNo && (
                      <span className="rounded-full border border-secondary/30 bg-secondary/8 px-2 py-0.5 text-[10px] font-bold text-secondary tracking-wide">
                        Reg. {doc.regNo}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm font-semibold text-primary">{doc.role}</p>
                  <p className="mt-1 text-xs text-slate-400">{doc.qualification}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{doc.experience}</p>

                  {doc.specializations && (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {doc.specializations.map((s) => (
                        <span key={s} className="rounded-full border border-primary/15 bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {doc.membership && (
                    <p className="mt-2.5 text-[10px] italic text-slate-400">{doc.membership}</p>
                  )}

                  {doc.phone && (
                    <a
                      href={`tel:${doc.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline"
                    >
                      <LuPhone className="h-3 w-3" /> {doc.phone}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Doctor detail modal ── */}
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
            className={`relative flex w-full max-w-lg max-h-[88vh] flex-col overflow-hidden rounded-3xl bg-white
                       shadow-[0_8px_16px_rgba(0,0,0,0.08),_0_32px_80px_rgba(0,0,0,0.25)]
                       transition-all duration-300
                       ${visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-6"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient bar */}
            <div className="h-1 w-full flex-shrink-0 bg-gradient-to-r from-[#1e9b8d] to-[#2a487e]" />

            {/* Header */}
            <div className="flex items-start gap-4 px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-100">
                <Image
                  src={selected.avatar}
                  alt={selected.name}
                  fill
                  className="object-cover object-top"
                  sizes="56px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[17px] font-extrabold leading-tight text-[#071224]" style={{ fontFamily: "var(--font-heading)" }}>
                    {selected.name}
                  </h3>
                  {selected.regNo && (
                    <span className="rounded-full border border-[#2a487e]/30 bg-[#2a487e]/8 px-2 py-0.5 text-[10px] font-bold text-[#2a487e]">
                      Reg. {selected.regNo}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm font-semibold text-[#1e9b8d]">{selected.role}</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mt-0.5">
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
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Qualification & Experience */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                  <LuBadgeCheck className="h-4 w-4 shrink-0 text-[#1e9b8d] mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Qualification</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-[#071224]">{selected.qualification}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                  <LuBriefcase className="h-4 w-4 shrink-0 text-[#1e9b8d] mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Experience</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-[#071224]">{selected.experience}</p>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              {selected.specializations && (
                <div>
                  <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Specializations</p>
                  <ul className="space-y-2">
                    {selected.specializations.map((s) => (
                      <li key={s} className="flex items-center gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1e9b8d]/10">
                          <LuCheck className="h-3 w-3 text-[#1e9b8d]" />
                        </span>
                        <span className="text-[13.5px] font-medium text-slate-700">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Membership */}
              {selected.membership && (
                <div className="flex items-start gap-2.5 rounded-xl border border-[#1e9b8d]/15 bg-[#1e9b8d]/5 px-4 py-3">
                  <LuCalendar className="h-4 w-4 shrink-0 text-[#1e9b8d] mt-0.5" />
                  <p className="text-[12.5px] font-medium text-slate-600 italic">{selected.membership}</p>
                </div>
              )}

              {/* Phone */}
              {selected.phone && (
                <a
                  href={`tel:${selected.phone}`}
                  className="flex items-center gap-2.5 text-sm font-semibold text-[#1e9b8d] transition hover:text-[#0f7268]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1e9b8d]/30 bg-[#1e9b8d]/8">
                    <LuPhone className="h-3.5 w-3.5" />
                  </div>
                  {selected.phone}
                </a>
              )}
            </div>

            {/* Footer CTA */}
            <div className="flex-shrink-0 border-t border-slate-100 px-6 py-4 bg-slate-50/60">
              <BookAppointmentButton
                label={
                  <span className="flex items-center gap-2">
                    <LuCalendar className="h-4 w-4" />
                    Book an Appointment
                  </span>
                }
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] py-3 text-sm font-bold text-white
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
