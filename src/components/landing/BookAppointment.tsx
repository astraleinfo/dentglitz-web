"use client";

import { useState, useRef, useEffect } from "react";
import {
  LuUser, LuPhone, LuMail, LuCalendar, LuClock, LuMessageSquare,
  LuChevronDown, LuCircleCheck, LuX, LuArrowRight, LuShieldCheck, LuStar, LuUsers, LuSparkles,
} from "react-icons/lu";
import { FaTooth } from "react-icons/fa";

const treatments = [
  "Preventive Dentistry",
  "Restorative Dentistry",
  "Endodontics (Root Canal)",
  "Pediatric Dentistry",
  "Periodontics (Gum Care)",
  "Prosthodontics",
  "Dental Implants",
  "Orthodontics",
  "Cosmetic & Aesthetic Dentistry",
  "Oral Surgery",
  "Emergency Dental Care",
  "General Checkup",
];

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "05:00 PM",
];

const highlights = [
  { icon: LuShieldCheck, text: "Free initial consultation available" },
  { icon: LuSparkles,    text: "Same-day emergency appointments" },
  { icon: LuStar,        text: "8+ years of dental excellence" },
  { icon: LuUsers,       text: "State-of-the-art technology" },
];

const stats = [
  { value: "8+",   label: "Years of Experience" },
  { value: "2+",   label: "Specialized Doctors" },
  { value: "500+", label: "Happy Smiles" },
  { value: "100%", label: "Patient Satisfaction" },
];

type FormData = {
  name: string; phone: string; email: string;
  treatment: string; date: string; time: string; message: string;
};
type Errors = Partial<Record<keyof FormData, string>>;

const inputBase =
  "w-full rounded-xl border bg-white/6 backdrop-blur-sm pl-11 pr-4 py-3.5 text-sm text-white/90 placeholder-white/30 outline-none transition-all";
const inputIdle   = "border-white/12 focus:border-[#4DD4C5]/60 focus:ring-2 focus:ring-[#4DD4C5]/12";
const inputError  = "border-red-400/60 focus:ring-2 focus:ring-red-400/20";

export function BookAppointment() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm]       = useState<FormData>({ name: "", phone: "", email: "", treatment: "", date: "", time: "", message: "" });
  const [errors, setErrors]   = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    sectionRef.current?.querySelectorAll(".reveal, .reveal-right").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  function validate(): boolean {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\d{10,}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Valid phone required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.treatment) e.treatment = "Please select a treatment";
    if (!form.date) e.date = "Please pick a date";
    if (!form.time) e.time = "Please pick a time";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const field = (key: keyof FormData, label: string, Icon: React.ElementType, type = "text", placeholder = "") => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12.5px] font-semibold text-white/65" style={{ fontFamily: "var(--font-sans)" }}>
        {label} <span className="text-[#4DD4C5]">*</span>
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/35 pointer-events-none" />
        <input
          type={type}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          className={`${inputBase} ${errors[key] ? inputError : inputIdle}`}
          style={{ fontFamily: "var(--font-sans)", colorScheme: "dark" }}
        />
      </div>
      {errors[key] && <p className="text-[11px] text-red-400">{errors[key]}</p>}
    </div>
  );

  return (
    <section ref={sectionRef} id="book" className="relative overflow-hidden bg-[#071224] py-24">

      {/* ── Glow blobs (hero pattern) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#1e9b8d]/10 blur-[120px] animate-blob" />
        <div className="absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-[#2a487e]/15 blur-[100px] animate-blob delay-400" />
        <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-[#4DD4C5]/8 blur-[80px] animate-blob delay-700" />
      </div>

      {/* ── Particles (hero pattern) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#4DD4C5]/30"
            style={{
              left: `${10 + i * 7.5}%`,
              top: `${15 + (i % 5) * 17}%`,
              animation: `particle-float ${4 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.45fr] lg:items-start">

          {/* ── LEFT: content ── */}
          <div className="reveal pt-2">

            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4DD4C5]/30 bg-[#4DD4C5]/8 px-4 py-1.5 backdrop-blur-sm">
              <FaTooth className="h-3.5 w-3.5 text-[#4DD4C5]" />
              <span className="text-[11px] font-semibold tracking-wide text-[#4DD4C5]">Book Appointment</span>
            </div>

            {/* Heading */}
            <h2
              className="mb-5 text-4xl font-extrabold leading-[1.12] text-white xl:text-[2.6rem]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Start Your Smile<br />
              <span className="bg-gradient-to-r from-[#4DD4C5] to-[#1e9b8d] bg-clip-text text-transparent">
                Journey Today
              </span>
            </h2>

            {/* Accent line */}
            <div className="mb-6 h-0.5 w-12 rounded-full bg-gradient-to-r from-[#4DD4C5] to-[#1e9b8d]" />

            <p className="mb-8 text-[15px] leading-relaxed text-white/60" style={{ fontFamily: "var(--font-sans)" }}>
              Schedule a consultation with our expert team and experience world-class dental care delivered with precision, compassion and the latest technology.
            </p>

            {/* Highlights */}
            <div className="mb-10 flex flex-col gap-3">
              {highlights.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-4 py-3 backdrop-blur-sm"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#4DD4C5]/35 bg-[#4DD4C5]/10">
                    <Icon className="h-3.5 w-3.5 text-[#4DD4C5]" />
                  </div>
                  <span className="text-sm font-medium text-white/75" style={{ fontFamily: "var(--font-sans)" }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/8 bg-white/5 px-3 py-3.5 text-center backdrop-blur-sm"
                >
                  <p className="text-xl font-extrabold text-white" style={{ fontFamily: "var(--font-heading)" }}>{value}</p>
                  <p className="mt-0.5 text-[10px] font-medium leading-tight text-white/50" style={{ fontFamily: "var(--font-sans)" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: glass form card ── */}
          <div className="reveal-right">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/6 p-7 shadow-[0_8px_16px_rgba(0,0,0,0.2),_0_32px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-9">

              {/* Top teal accent bar */}
              <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-[#4DD4C5] via-[#1e9b8d] to-[#2a487e]" />

              {/* Inner glow */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4DD4C5]/4 via-transparent to-[#2a487e]/4" />

              {/* Card header */}
              <div className="relative mb-7 flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4DD4C5] to-[#1e9b8d] shadow-[0_4px_16px_rgba(30,155,141,0.5)]">
                  <LuSparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3
                    className="text-[16px] font-extrabold text-white"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Book Your Consultation
                  </h3>
                  <p className="text-[11px] text-white/45" style={{ fontFamily: "var(--font-sans)" }}>
                    We'll confirm within 30 minutes
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="relative space-y-4" noValidate>
                {/* Row 1 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {field("name",  "Full Name",     LuUser,  "text",  "Your full name")}
                  {field("phone", "Mobile Number", LuPhone, "tel",   "+91 XXXXX XXXXX")}
                </div>

                {/* Row 2 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {field("email", "Email Address", LuMail, "email", "you@email.com")}

                  {/* Treatment select */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12.5px] font-semibold text-white/65" style={{ fontFamily: "var(--font-sans)" }}>
                      Treatment Type <span className="text-[#4DD4C5]">*</span>
                    </label>
                    <div className="relative">
                      <FaTooth className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/35 pointer-events-none" />
                      <select
                        value={form.treatment}
                        onChange={(e) => setForm((f) => ({ ...f, treatment: e.target.value }))}
                        className={`${inputBase} ${errors.treatment ? inputError : inputIdle} appearance-none pr-10`}
                        style={{ fontFamily: "var(--font-sans)", colorScheme: "dark" }}
                      >
                        <option value="" disabled>Select Treatment</option>
                        {treatments.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <LuChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/35 pointer-events-none" />
                    </div>
                    {errors.treatment && <p className="text-[11px] text-red-400">{errors.treatment}</p>}
                  </div>
                </div>

                {/* Row 3: Date + Time */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Date */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12.5px] font-semibold text-white/65" style={{ fontFamily: "var(--font-sans)" }}>
                      Preferred Date <span className="text-[#4DD4C5]">*</span>
                    </label>
                    <div className="relative">
                      <LuCalendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/35 pointer-events-none" />
                      <input
                        type="date"
                        min={minDate}
                        value={form.date}
                        onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                        className={`${inputBase} ${errors.date ? inputError : inputIdle}`}
                        style={{ fontFamily: "var(--font-sans)", colorScheme: "dark" }}
                      />
                    </div>
                    {errors.date && <p className="text-[11px] text-red-400">{errors.date}</p>}
                  </div>

                  {/* Time */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12.5px] font-semibold text-white/65" style={{ fontFamily: "var(--font-sans)" }}>
                      Preferred Time <span className="text-[#4DD4C5]">*</span>
                    </label>
                    <div className="relative">
                      <LuClock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/35 pointer-events-none" />
                      <select
                        value={form.time}
                        onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                        className={`${inputBase} ${errors.time ? inputError : inputIdle} appearance-none pr-10`}
                        style={{ fontFamily: "var(--font-sans)", colorScheme: "dark" }}
                      >
                        <option value="" disabled>Select Time</option>
                        {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <LuChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/35 pointer-events-none" />
                    </div>
                    {errors.time && <p className="text-[11px] text-red-400">{errors.time}</p>}
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-semibold text-white/65" style={{ fontFamily: "var(--font-sans)" }}>
                    Message <span className="text-white/30 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <LuMessageSquare className="absolute left-4 top-4 h-4 w-4 text-white/35 pointer-events-none" />
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Any specific concerns or additional information..."
                      className="w-full resize-none rounded-xl border border-white/12 bg-white/6 backdrop-blur-sm pl-11 pr-4 py-3.5 text-sm text-white/90 placeholder-white/30 outline-none transition-all focus:border-[#4DD4C5]/60 focus:ring-2 focus:ring-[#4DD4C5]/12"
                      style={{ fontFamily: "var(--font-sans)" }}
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] py-4 text-sm font-bold text-white
                             shadow-[0_4px_16px_rgba(0,0,0,0.2),_0_8px_32px_rgba(30,155,141,0.45)]
                             transition-all duration-300
                             hover:from-[#25b8a8] hover:to-[#344f8c]
                             hover:shadow-[0_6px_20px_rgba(0,0,0,0.25),_0_12px_48px_rgba(30,155,141,0.65)]
                             hover:scale-[1.01]
                             disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Scheduling…
                    </>
                  ) : (
                    <>
                      Schedule Consultation <LuArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* Privacy note */}
                <p className="text-center text-[10.5px] text-white/30" style={{ fontFamily: "var(--font-sans)" }}>
                  Your information is safe with us. We never share your data.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* ── Success popup ── */}
      {success && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-[#071224]/80 backdrop-blur-sm">
          <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-10 shadow-[0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl text-center animate-zoom-in">

            {/* Top bar */}
            <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-[#4DD4C5] to-[#1e9b8d]" />

            {/* Inner glow */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4DD4C5]/5 via-transparent to-[#2a487e]/5" />

            <button
              onClick={() => { setSuccess(false); setForm({ name: "", phone: "", email: "", treatment: "", date: "", time: "", message: "" }); }}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/50 transition hover:bg-white/15 hover:text-white"
            >
              <LuX className="h-4 w-4" />
            </button>

            <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#4DD4C5]/30 bg-[#4DD4C5]/10">
              <LuCircleCheck className="h-10 w-10 text-[#4DD4C5]" />
              <div className="absolute inset-0 rounded-full bg-[#4DD4C5]/10 blur-[12px]" />
            </div>

            <h3
              className="relative mb-2 text-2xl font-extrabold text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Appointment Booked!
            </h3>
            <p
              className="relative mb-7 text-sm leading-relaxed text-white/55"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Thank you! We'll confirm your appointment within 30 minutes via call or WhatsApp.
            </p>

            <button
              onClick={() => { setSuccess(false); setForm({ name: "", phone: "", email: "", treatment: "", date: "", time: "", message: "" }); }}
              className="relative rounded-xl bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] px-8 py-3 text-sm font-bold text-white
                         shadow-[0_4px_16px_rgba(30,155,141,0.4)]
                         transition-all hover:from-[#25b8a8] hover:to-[#344f8c] hover:shadow-[0_6px_24px_rgba(30,155,141,0.6)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
