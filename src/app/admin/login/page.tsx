"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  LuMail, LuLock, LuEye, LuEyeOff,
  LuCalendarCheck2, LuShieldCheck, LuArrowRight,
} from "react-icons/lu";

import { api, saveSession } from "@/lib/api";
import { useSiteConfig } from "@/components/ThemeProvider";

const FEATURES = [
  { icon: LuCalendarCheck2, text: "Real-time appointment management" },
  { icon: LuShieldCheck,    text: "Secure, role-based access control" },
];

export default function AdminLogin() {
  const cfg = useSiteConfig();
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const session = await api.login(email, password);
      saveSession(session);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">

      {/* ════════ Left brand panel ════════ */}
      <div className="login-panel-bg relative hidden overflow-hidden lg:flex lg:w-[46%] xl:w-[42%]">
        {/* Dot-grid texture */}
        <div className="login-panel-mesh pointer-events-none absolute inset-0 opacity-[0.035]" />

        {/* Ambient glow orbs */}
        <div className="animate-pulse-slow pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="animate-pulse-slow pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl delay-300" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-white/5 blur-2xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between px-10 py-12 xl:px-14">

          {/* Logo + clinic name */}
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cfg.logoUrl}
              alt={cfg.clinicName}
              className="h-11 w-11 rounded-2xl logo-bg object-contain p-1.5 ring-1 ring-white/20 shadow-lg"
            />
            <span className="font-heading text-xl font-bold tracking-tight text-white">
              {cfg.clinicName}
            </span>
          </div>

          {/* Centre copy */}
          <div className="space-y-8">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Admin Portal
              </p>
              <h2 className="font-heading text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                Manage your<br />
                <span className="login-gradient-text">clinic smarter</span>
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
                {cfg.tagline}
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-3">
              {FEATURES.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                    <Icon className="text-sm text-teal-300" />
                  </span>
                  <span className="text-sm text-white/65">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom tagline */}
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://astraleinfo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white/50"
            >
              Astrale
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>

      {/* ════════ Right form panel ════════ */}
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-5 py-12 sm:px-10">
        <div className="w-full max-w-[420px] animate-fade-up">

          {/* Mobile-only logo */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cfg.logoUrl} alt={cfg.clinicName} className="h-9 w-9 rounded-xl" />
            <span className="font-heading text-base font-bold text-secondary">
              {cfg.clinicName}
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-extrabold text-secondary">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Card form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <form onSubmit={submit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Email address
                </label>
                <div className="relative">
                  <LuMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-secondary outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Password
                </label>
                <div className="relative">
                  <LuLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-slate-400" />
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-11 text-sm text-secondary outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  >
                    {showPwd ? <LuEyeOff className="text-[17px]" /> : <LuEye className="text-[17px]" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="login-btn-gradient group flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  "Signing in…"
                ) : (
                  <>
                    Sign in
                    <LuArrowRight className="text-base transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-slate-400">
            Access is restricted to authorised staff only.
          </p>
        </div>
      </div>
    </div>
  );
}
