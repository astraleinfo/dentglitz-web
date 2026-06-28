"use client";

import { useState } from "react";
import {
  LuPencil, LuLock, LuMail, LuCheckCircle2, LuAlertCircle,
  LuEye, LuEyeOff, LuShieldCheck,
} from "react-icons/lu";
import { api } from "@/lib/api";
import type { AuthSession } from "@/lib/types";
import { Avatar } from "@/components/admin/ui";

interface Props {
  session: AuthSession;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
}

function PasswordInput({
  value, onChange, placeholder, id,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  id: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-11 text-sm text-secondary outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
      >
        {show ? <LuEyeOff className="text-[17px]" /> : <LuEye className="text-[17px]" />}
      </button>
    </div>
  );
}

function Toast({ ok, msg }: { ok: boolean; msg: string }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
        ok
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
      }`}
    >
      {ok ? (
        <LuCheckCircle2 className="shrink-0 text-base" />
      ) : (
        <LuAlertCircle className="shrink-0 text-base" />
      )}
      {msg}
    </div>
  );
}

export function ProfilePanel({ session, onNameChange, onEmailChange }: Props) {
  const [name, setName]             = useState(session.name);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameToast, setNameToast]   = useState<{ ok: boolean; msg: string } | null>(null);

  const [curPwd, setCurPwd]         = useState("");
  const [newPwd, setNewPwd]         = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdToast, setPwdToast]     = useState<{ ok: boolean; msg: string } | null>(null);

  const [newEmail, setNewEmail]       = useState("");
  const [emailPwd, setEmailPwd]       = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailToast, setEmailToast]   = useState<{ ok: boolean; msg: string } | null>(null);

  function flash(
    set: (v: { ok: boolean; msg: string } | null) => void,
    ok: boolean,
    msg: string,
  ) {
    set({ ok, msg });
    setTimeout(() => set(null), 4000);
  }

  async function handleNameSave(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setNameLoading(true);
    try {
      await api.updateProfile(trimmed);
      onNameChange(trimmed);
      flash(setNameToast, true, "Name updated successfully");
    } catch (err: unknown) {
      flash(setNameToast, false, err instanceof Error ? err.message : "Failed to update name");
    } finally {
      setNameLoading(false);
    }
  }

  async function handleEmailSave(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed) return;
    setEmailLoading(true);
    try {
      const res = await api.changeEmail(trimmed, emailPwd);
      onEmailChange(res.email);
      flash(setEmailToast, true, "Email updated successfully");
      setNewEmail(""); setEmailPwd("");
    } catch (err: unknown) {
      flash(setEmailToast, false, err instanceof Error ? err.message : "Failed to update email");
    } finally {
      setEmailLoading(false);
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      flash(setPwdToast, false, "New passwords do not match");
      return;
    }
    if (newPwd.length < 6) {
      flash(setPwdToast, false, "Password must be at least 6 characters");
      return;
    }
    setPwdLoading(true);
    try {
      await api.changePassword(curPwd, newPwd);
      flash(setPwdToast, true, "Password changed successfully");
      setCurPwd(""); setNewPwd(""); setConfirmPwd("");
    } catch (err: unknown) {
      flash(setPwdToast, false, err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setPwdLoading(false);
    }
  }

  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400";
  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-secondary outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15";

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* ── Hero card ── */}
      <div className="overflow-hidden rounded-2xl shadow-md">
        {/* Gradient banner — avatar is absolute so it straddles the edge */}
        <div className="relative h-36 bg-gradient-to-br from-secondary via-secondary/85 to-primary">
          <div className="absolute -bottom-9 left-6 rounded-full ring-4 ring-white shadow-lg">
            <Avatar name={session.name} size={72} />
          </div>
        </div>

        {/* White content — pt-14 makes room for the overlapping avatar */}
        <div className="bg-white px-6 pt-12 pb-5">
          <h1 className="text-xl font-bold leading-tight text-secondary">{session.name}</h1>
          <p className="mt-0.5 text-sm text-slate-400">{session.email}</p>
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <LuShieldCheck className="text-sm" /> Administrator
            </span>
          </div>
        </div>
      </div>

      {/* ── Cards ── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {/* Change name */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <LuPencil className="text-base text-primary" />
            </span>
            <div>
              <p className="text-sm font-bold text-secondary">Display Name</p>
              <p className="text-xs text-slate-400">Update how your name appears</p>
            </div>
          </div>

          <form onSubmit={handleNameSave} className="space-y-4">
            <div>
              <label htmlFor="profile-name" className={labelCls}>Full Name</label>
              <input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputCls}
                placeholder="Enter your full name"
              />
            </div>

            {nameToast && <Toast ok={nameToast.ok} msg={nameToast.msg} />}

            <button
              type="submit"
              disabled={nameLoading || !name.trim() || name.trim() === session.name}
              className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
            >
              {nameLoading ? "Saving…" : "Save Name"}
            </button>
          </form>
        </div>

        {/* Change email */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
              <LuMail className="text-base text-amber-500" />
            </span>
            <div>
              <p className="text-sm font-bold text-secondary">Email Address</p>
              <p className="text-xs text-slate-400">Update your login email</p>
            </div>
          </div>

          <form onSubmit={handleEmailSave} className="space-y-3">
            <div>
              <label htmlFor="new-email" className={labelCls}>New Email</label>
              <input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className={inputCls}
                placeholder="new@email.com"
              />
            </div>
            <div>
              <label htmlFor="email-pwd" className={labelCls}>Confirm with Password</label>
              <PasswordInput
                id="email-pwd"
                value={emailPwd}
                onChange={setEmailPwd}
                placeholder="Enter your password"
              />
            </div>

            {emailToast && <Toast ok={emailToast.ok} msg={emailToast.msg} />}

            <button
              type="submit"
              disabled={emailLoading || !newEmail.trim() || !emailPwd}
              className="mt-1 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
            >
              {emailLoading ? "Updating…" : "Update Email"}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10">
              <LuLock className="text-base text-secondary" />
            </span>
            <div>
              <p className="text-sm font-bold text-secondary">Password</p>
              <p className="text-xs text-slate-400">Change your login password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSave} className="space-y-3">
            <div>
              <label htmlFor="cur-pwd" className={labelCls}>Current Password</label>
              <PasswordInput
                id="cur-pwd"
                value={curPwd}
                onChange={setCurPwd}
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label htmlFor="new-pwd" className={labelCls}>New Password</label>
              <PasswordInput
                id="new-pwd"
                value={newPwd}
                onChange={setNewPwd}
                placeholder="Min 6 characters"
              />
            </div>
            <div>
              <label htmlFor="confirm-pwd" className={labelCls}>Confirm New Password</label>
              <PasswordInput
                id="confirm-pwd"
                value={confirmPwd}
                onChange={setConfirmPwd}
                placeholder="Repeat new password"
              />
            </div>

            {pwdToast && <Toast ok={pwdToast.ok} msg={pwdToast.msg} />}

            <button
              type="submit"
              disabled={pwdLoading || !curPwd || !newPwd || !confirmPwd}
              className="w-full rounded-xl bg-gradient-to-r from-secondary to-secondary/80 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[0.98] disabled:opacity-40 mt-1"
            >
              {pwdLoading ? "Changing…" : "Change Password"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
