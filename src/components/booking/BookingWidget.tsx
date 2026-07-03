"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaPhoneAlt,
  FaRegClock,
  FaShieldAlt,
  FaTimes,
  FaCalendarCheck,
  FaMobileAlt,
} from "react-icons/fa";
import PhoneInput from "react-phone-input-2";

import { api } from "@/lib/api";
import type { AppointmentType, Slot, Booking } from "@/lib/types";
import { useSiteConfig } from "@/components/ThemeProvider";
import { media } from "@/config/media";
import { LuClock } from "react-icons/lu";

type Step = "slots" | "details" | "otp" | "done";
const STEP_INDEX: Record<Step, number> = {
  slots: 0,
  details: 1,
  otp: 2,
  done: 3,
};
const STEPS = ["Time", "Details", "Verify", "Confirm"];

const TZ_TO_COUNTRY: Record<string, string> = {
  "Asia/Kolkata": "in",
  "Asia/Calcutta": "in",
  "Asia/Dubai": "ae",
  "Asia/Muscat": "ae",
  "Asia/Karachi": "pk",
  "Asia/Dhaka": "bd",
  "Asia/Riyadh": "sa",
  "Asia/Kuwait": "kw",
  "Asia/Bahrain": "bh",
  "Asia/Qatar": "qa",
  "Asia/Aden": "ye",
  "Europe/London": "gb",
  "America/New_York": "us",
  "America/Chicago": "us",
  "America/Los_Angeles": "us",
};

function detectCountry(): string {
  if (typeof window === "undefined") return "in";
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return TZ_TO_COUNTRY[tz] ?? "in";
}

function groupByDay(slots: Slot[]): Record<string, Slot[]> {
  return slots.reduce(
    (acc, slot) => {
      const day = slot.start_time.slice(0, 10);
      (acc[day] ||= []).push(slot);
      return acc;
    },
    {} as Record<string, Slot[]>,
  );
}

const fmtDay = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // always 12-hour am/pm, regardless of server/browser locale
  });

export function BookingWidget({ onClose }: { onClose?: () => void }) {
  const cfg = useSiteConfig();
  const appointmentTypes = cfg.appointmentTypes;
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("slots");

  const [appointmentType, setAppointmentType] = useState<AppointmentType>(
    (appointmentTypes[0]?.id ?? "general") as AppointmentType
  );
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [form, setForm] = useState({ name: "", reason: "" });
  const [phone, setPhone] = useState("");
  const [defaultCountry] = useState<string>(detectCountry);
  const [otpCode, setOtpCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);

  // Reload slots whenever appointment type changes.
  useEffect(() => {
    setLoading(true);
    setError(null);
    setSelected(null);
    api
      .getSlots(undefined, appointmentType)
      .then((data) => {
        setSlots(data);
        const dayKeys = Object.keys(groupByDay(data));
        // Default to today if it has open slots, otherwise the first available day.
        const n = new Date();
        const today = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
        const todayKey = dayKeys.find((d) => d.slice(0, 10) === today);
        setActiveDay(todayKey ?? dayKeys[0] ?? null);
      })
      .catch(() =>
        setError("Could not load available slots. Is the backend running?"),
      )
      .finally(() => setLoading(false));
  }, [appointmentType]);

  const byDay = useMemo(() => groupByDay(slots), [slots]);
  const days = Object.keys(byDay);

  const selectedTypeMeta = appointmentTypes.find((t) => t.id === appointmentType) ?? appointmentTypes[0];;

  async function handleSendOtp() {
    if (!phone) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.sendOtp("+" + phone);
      setOtpCode("");
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyAndBook() {
    if (!selected || otpCode.length < 4) return;
    setSubmitting(true);
    setError(null);
    try {
      const e164 = "+" + phone;
      const { token } = await api.verifyOtp(e164, otpCode);
      const result = await api.createBooking({
        start_time: selected.start_time,
        patient: { name: form.name, phone: e164 },
        appointment_type: appointmentType,
        reason: form.reason,
        otp_token: token,
      });
      setBooking(result);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 min-h-0 grid md:grid-cols-[36%_64%]">
      {/* ── Left brand panel (desktop only) ── */}
      <aside className="relative hidden overflow-hidden md:flex md:flex-col">
        {/* Background */}
        <div className="absolute inset-0 bg-[#071224]" />
        {/* Hero image at low opacity */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#071224]/70 via-[#071224]/60 to-[#071224]/95" />

        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-[320px] w-[320px] rounded-full bg-[#1e9b8d]/15 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-[280px] w-[280px] rounded-full bg-[#2a487e]/20 blur-[80px]" />

        <div className="relative flex h-full flex-col text-white">
          {/* Content — justify-between keeps top content and phone card at opposite ends */}
          <div className="flex flex-1 flex-col justify-between px-6 pt-6 pb-6">
            {/* Top: Badge + heading + features */}
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#4DD4C5]/30 bg-[#4DD4C5]/8 px-3 py-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4DD4C5]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4DD4C5]">
                  Book Appointment
                </span>
              </div>
              <h3
                className="text-2xl font-extrabold leading-snug text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Your Smile Starts{" "}
                <span className="bg-gradient-to-r from-[#4DD4C5] to-[#1e9b8d] bg-clip-text text-transparent">
                  Here
                </span>
              </h3>
              <div className="mt-3 h-0.5 w-10 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#4DD4C5]" />
              <p className="mt-3 text-sm text-white/50" style={{ fontFamily: "var(--font-sans)" }}>
                {cfg.tagline}
              </p>

              {/* Features */}
              <ul className="mt-7 space-y-3.5">
                {[
                  { icon: FaShieldAlt,     t: "Gentle, painless care" },
                  { icon: FaRegClock,      t: "Same-day appointments" },
                  { icon: FaCalendarCheck, t: "Instant confirmation" },
                ].map(({ icon: Icon, t }) => (
                  <li key={t} className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#4DD4C5]/30 bg-[#4DD4C5]/10">
                      <Icon className="h-3.5 w-3.5 text-[#4DD4C5]" />
                    </div>
                    <span className="text-white/65">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom: Phone help card — always anchored to the bottom */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">Need help?</p>
              <a
                href={`tel:${cfg.phone}`}
                className="mt-2 flex items-center gap-2.5 text-sm font-semibold text-white transition-colors hover:text-[#4DD4C5]"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#4DD4C5]/40 bg-[#4DD4C5]/10">
                  <FaPhoneAlt className="h-3 w-3 text-[#4DD4C5]" />
                </div>
                {cfg.phone}
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Right flow ── */}
      <div className="flex min-w-0 flex-col overflow-hidden bg-white">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1e9b8d]">
              {step === "done" ? "All done" : "Book an appointment"}
            </p>
            <h3
              className="mt-1 text-xl font-extrabold text-[#071224]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {step === "slots" && "Choose a date & time"}
              {step === "details" && "Your details"}
              {step === "otp" && "Verify your number"}
              {step === "done" && "You're all set!"}
            </h3>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600"
            >
              <FaTimes className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-3.5 sm:gap-2 sm:px-6 sm:py-4">
          {STEPS.map((label, i) => {
            const current = STEP_INDEX[step];
            const done = i < current;
            const on = i === current;
            return (
              <div key={label} className="flex flex-1 items-center gap-2">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    done
                      ? "bg-[#1e9b8d] text-white shadow-[0_2px_8px_rgba(30,155,141,0.4)]"
                      : on
                        ? "bg-gradient-to-br from-[#1e9b8d] to-[#2a487e] text-white shadow-[0_2px_8px_rgba(30,155,141,0.3)]"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {done ? <FaCheck className="h-3 w-3" /> : i + 1}
                </span>
                <span
                  className={`hidden text-xs font-semibold sm:block ${on || done ? "text-[#071224]" : "text-slate-400"}`}
                >
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <span
                    className={`h-0.5 flex-1 rounded-full transition-all ${done ? "bg-[#1e9b8d]" : "bg-slate-100"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {loading && (
            <p className="py-10 text-center text-sm text-slate-400">
              Loading available slots…
            </p>
          )}
          {error && step !== "details" && step !== "otp" && (
            <p className="mb-4 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-600">
              {error}
            </p>
          )}

          {/* STEP 1 — appointment type + slots */}
          {step === "slots" && (
            <>
              {/* Appointment type selector */}
              <p className="mb-2 text-sm font-semibold text-slate-600">Appointment type</p>
              <div className="mb-5 grid grid-cols-2 gap-3">
                {appointmentTypes.map((t) => {
                  const on = appointmentType === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAppointmentType(t.id as AppointmentType)}
                      className={`flex flex-col items-start gap-0.5 rounded-xl border p-3 text-left transition ${
                        on
                          ? "border-secondary bg-secondary/8 ring-2 ring-secondary/20"
                          : "border-slate-200 hover:border-primary hover:bg-primary/5"
                      }`}
                    >
                      <span className={`flex items-center gap-1.5 text-sm font-bold ${on ? "text-secondary" : "text-slate-700"}`}>
                        <LuClock className={`text-xs ${on ? "text-primary" : "text-slate-400"}`} />
                        {t.label}
                      </span>
                      <span className={`text-xs ${on ? "text-secondary/70" : "text-slate-400"}`}>
                        {t.duration} min · {t.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {loading ? (
                <p className="py-6 text-center text-slate-500">Loading slots…</p>
              ) : days.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-slate-100 bg-slate-50">
                    <FaRegClock className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-500">
                    No open slots right now. Please check back later.
                  </p>
                </div>
              ) : (
                <>
                  {/* Day tabs — bleeds to edges so scroll doesn't show gap */}
                  <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
                    {days.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setActiveDay(day)}
                        className={`flex min-w-[72px] shrink-0 items-center justify-center rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 sm:min-w-[80px] ${
                          activeDay === day
                            ? "border-[#1e9b8d] bg-gradient-to-b from-[#1e9b8d] to-[#2a487e] text-white shadow-[0_4px_12px_rgba(30,155,141,0.3)]"
                            : "border-slate-200 text-slate-600 hover:border-[#1e9b8d]/40 hover:text-[#1e9b8d]"
                        }`}
                      >
                        {fmtDay(day)}
                      </button>
                    ))}
                  </div>

                  <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Available times
                  </p>
                  <div className="grid grid-cols-2 gap-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4">
                    {(activeDay ? byDay[activeDay] : []).map((slot) => (
                      <button
                        key={slot.start_time}
                        type="button"
                        onClick={() => {
                          setSelected(slot);
                          setStep("details");
                        }}
                        className="rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-[#1e9b8d] hover:bg-gradient-to-b hover:from-[#1e9b8d] hover:to-[#2a487e] hover:text-white hover:shadow-[0_4px_12px_rgba(30,155,141,0.3)]"
                      >
                        {fmtTime(slot.start_time)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* STEP 2 — details */}
          {step === "details" && selected && (
            <div className="space-y-4">
              {/* Selected slot chip */}
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#1e9b8d]/20 bg-[#1e9b8d]/8 p-3 text-sm">
                <FaCalendarCheck className="shrink-0 text-[#1e9b8d]" />
                <span className="min-w-0 flex-1 text-[#071224]">
                  <b>{fmtDay(selected.start_time.slice(0, 10))}</b> at{" "}
                  <b>{fmtTime(selected.start_time)}</b>
                </span>
                <button
                  type="button"
                  onClick={() => setStep("slots")}
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#1e9b8d] hover:underline"
                >
                  <FaArrowLeft className="h-2.5 w-2.5" /> change
                </button>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="details_name"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Full name
                </label>
                <input
                  id="details_name"
                  required
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#071224] outline-none placeholder:text-slate-300 transition focus:border-[#1e9b8d] focus:ring-2 focus:ring-[#1e9b8d]/15"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="details_phone"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Phone number
                </label>
                <PhoneInput
                  inputProps={{ id: "details_phone", required: true }}
                  country={defaultCountry}
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  enableSearch
                  searchPlaceholder="Search country…"
                  preferredCountries={["in", "ae", "sa", "pk", "gb", "us"]}
                />
              </div>

              {/* Reason */}
              <div>
                <label
                  htmlFor="details_reason"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Reason for visit{" "}
                  <span className="normal-case font-normal text-slate-400">
                    (optional)
                  </span>
                </label>
                <input
                  id="details_reason"
                  placeholder="e.g. Check-up, whitening…"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#071224] outline-none placeholder:text-slate-300 transition focus:border-[#1e9b8d] focus:ring-2 focus:ring-[#1e9b8d]/15"
                />
              </div>

              {error && (
                <p className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-600">
                  {error}
                </p>
              )}

              <button
                type="button"
                disabled={!form.name || !phone || submitting}
                onClick={handleSendOtp}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(30,155,141,0.35)] transition-all duration-300 hover:from-[#25b8a8] hover:to-[#344f8c] hover:shadow-[0_8px_24px_rgba(30,155,141,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {submitting ? (
                  "Sending code…"
                ) : (
                  <>
                    {" "}
                    Send verification code{" "}
                    <FaArrowRight className="h-3.5 w-3.5" />{" "}
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 3 — OTP */}
          {step === "otp" && selected && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#1e9b8d]/15 bg-[#1e9b8d]/6 p-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#1e9b8d]/25 bg-[#1e9b8d]/10">
                  <FaMobileAlt className="h-5 w-5 text-[#1e9b8d]" />
                </div>
                <p className="text-sm text-slate-600">
                  We sent a 6-digit code to{" "}
                  <b className="text-[#071224]">+{phone}</b>
                </p>
              </div>

              <div>
                <label
                  htmlFor="otp_code"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Verification code
                </label>
                <input
                  id="otp_code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-xl font-bold tracking-[0.4em] text-[#071224] outline-none placeholder:text-slate-200 transition focus:border-[#1e9b8d] focus:ring-2 focus:ring-[#1e9b8d]/15 sm:py-3.5 sm:text-2xl sm:tracking-[0.5em]"
                />
              </div>

              {error && (
                <p className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-600">
                  {error}
                </p>
              )}

              <button
                type="button"
                disabled={otpCode.length < 4 || submitting}
                onClick={handleVerifyAndBook}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(30,155,141,0.35)] transition-all duration-300 hover:from-[#25b8a8] hover:to-[#344f8c] hover:shadow-[0_8px_24px_rgba(30,155,141,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Verifying…" : "Verify & Book Appointment"}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="inline-flex items-center gap-1.5 text-slate-500 transition hover:text-[#071224]"
                >
                  <FaArrowLeft className="h-2.5 w-2.5" /> Change details
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={submitting}
                  className="text-[#1e9b8d] transition hover:underline disabled:opacity-50"
                >
                  Resend code
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 — done */}
          {step === "done" && booking && (
            <div className="py-6 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#1e9b8d]/20 bg-gradient-to-br from-[#1e9b8d]/15 to-[#2a487e]/15">
                <FaCheck className="h-8 w-8 text-[#1e9b8d]" />
              </div>
              <p
                className="text-xl font-extrabold text-[#071224]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Appointment confirmed!
              </p>
              <p className="mt-1.5 text-sm text-slate-500">
                {fmtDay(booking.start_time.slice(0, 10))} at{" "}
                {fmtTime(booking.start_time)}
              </p>

              <div className="mx-auto mt-5 w-full max-w-xs overflow-hidden rounded-2xl border border-slate-100">
                <div className="h-1 w-full bg-gradient-to-r from-[#1e9b8d] to-[#2a487e]" />
                <div className="space-y-3 p-4 text-sm">
                  {[
                    { label: "Reference", value: `#${booking.id}`, bold: true },
                    { label: "Patient", value: booking.patient.name },
                    { label: "Phone", value: booking.patient.phone },
                    { label: "Status", value: "Confirmed", green: true },
                  ].map(({ label, value, bold, green }) => (
                    <div
                      key={label}
                      className="flex items-start justify-between gap-2"
                    >
                      <span className="shrink-0 text-slate-400">{label}</span>
                      <span
                        className={`min-w-0 break-all text-right ${bold ? "font-bold text-[#071224]" : green ? "font-semibold text-emerald-600" : "text-[#071224]"}`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                A confirmation SMS has been sent to {booking.patient.phone}.
              </p>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] px-8 py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(30,155,141,0.35)] transition-all hover:from-[#25b8a8] hover:to-[#344f8c] hover:shadow-[0_8px_24px_rgba(30,155,141,0.5)]"
                >
                  Done
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
