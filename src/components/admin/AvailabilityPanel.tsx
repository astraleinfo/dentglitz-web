"use client";

import { useEffect, useState } from "react";
import {
  FaCalendarTimes,
  FaClock,
  FaSave,
  FaTrashAlt,
  FaBan,
} from "react-icons/fa";
import { ConfirmModal, type ConfirmModalProps } from "@/components/admin/ConfirmModal";
import { MdOutlineEventBusy, MdSchedule, MdToday } from "react-icons/md";

import { api } from "@/lib/api";
import type { BlockedPeriod, RecurringBreak, ScheduleDay } from "@/lib/types";

// ─────────────── helpers ───────────────
const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_SHORT  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const fmtDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });


// ─────────────── sub-component: Tab button ───────────────
function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold transition sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm ${
        active
          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-soft"
          : "text-slate-500 hover:bg-slate-100 hover:text-secondary"
      }`}
    >
      {children}
    </button>
  );
}

// ─────────────── Section 1: Weekly Schedule ───────────────
function WeeklyScheduleSection() {
  const [days, setDays] = useState<ScheduleDay[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    api.getSchedule().then((data) => {
      // Ensure all 7 days present, filling defaults if API returns partial
      const map = new Map(data.map((d) => [d.day_of_week, d]));
      const full: ScheduleDay[] = Array.from({ length: 7 }, (_, i) => ({
        id: map.get(i)?.id ?? 0,
        day_of_week: i,
        is_active: map.get(i)?.is_active ?? (i < 6),
        start_time: map.get(i)?.start_time ?? "09:00",
        end_time: map.get(i)?.end_time ?? "18:00",
      }));
      setDays(full);
    });
  }, []);

  function toggle(dow: number) {
    setDays((prev) =>
      prev.map((d) => (d.day_of_week === dow ? { ...d, is_active: !d.is_active } : d))
    );
  }
  function updateHour(dow: number, field: "start_time" | "end_time", val: string) {
    setDays((prev) =>
      prev.map((d) => (d.day_of_week === dow ? { ...d, [field]: val } : d))
    );
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      await api.saveSchedule(days.map(({ day_of_week, is_active, start_time, end_time }) => ({
        day_of_week, is_active, start_time, end_time,
      })));
      setMsg({ ok: true, text: "Schedule saved! Re-generate slots to apply changes." });
    } catch {
      setMsg({ ok: false, text: "Failed to save schedule. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  const activeDays = days.filter((d) => d.is_active).length;

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl bg-primary/8 px-3 py-2.5 text-xs text-secondary sm:px-4 sm:py-3 sm:text-sm">
        <MdSchedule className="mt-0.5 shrink-0 text-lg text-primary" />
        <p>
          Set which days the clinic is open and working hours for each day.
          This schedule <strong>repeats every week</strong> automatically.
          After saving, click <em>Auto-generate</em> in the Slot Overview tab to apply changes.
        </p>
      </div>

      {/* Day cards */}
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
        {days.map((d) => (
          <div
            key={d.day_of_week}
            className={`rounded-2xl border-2 p-3 shadow-card transition sm:p-4 ${
              d.is_active
                ? "border-primary/30 bg-primary/5"
                : "border-slate-200 bg-slate-50 opacity-60"
            }`}
          >
            {/* Day toggle */}
            <label className="flex cursor-pointer items-center gap-2">
              <span className="min-w-0 flex-1 truncate font-semibold text-secondary">
                {DAY_LABELS[d.day_of_week]}
              </span>
              <span className="hidden text-xs text-slate-400 sm:block">{DAY_SHORT[d.day_of_week]}</span>
              <button
                type="button"
                onClick={() => toggle(d.day_of_week)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  d.is_active ? "bg-primary" : "bg-slate-300"
                }`}
                aria-label={`Toggle ${DAY_LABELS[d.day_of_week]}`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    d.is_active ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>

            {/* Hours — only shown when active */}
            {d.is_active && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <p className="mb-1 text-[11px] font-medium text-slate-400">Opens</p>
                  <input
                    type="time"
                    aria-label={`${DAY_LABELS[d.day_of_week]} opening time`}
                    value={d.start_time}
                    onChange={(e) => updateHour(d.day_of_week, "start_time", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-medium text-slate-400">Closes</p>
                  <input
                    type="time"
                    aria-label={`${DAY_LABELS[d.day_of_week]} closing time`}
                    value={d.end_time}
                    onChange={(e) => updateHour(d.day_of_week, "end_time", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            {!d.is_active && (
              <p className="mt-2 text-xs text-slate-400">Closed — no slots on this day</p>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-secondary">{activeDays}</span> working{" "}
          {activeDays === 1 ? "day" : "days"} per week
        </p>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:opacity-90 disabled:opacity-60"
        >
          <FaSave /> {saving ? "Saving…" : "Save Schedule"}
        </button>
      </div>

      {msg && (
        <p className={`rounded-xl px-4 py-2.5 text-sm font-medium ${msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
          {msg.text}
        </p>
      )}
    </div>
  );
}

// ─────────────── Section 2: Time-Off Manager ───────────────
function TimeOffSection({ onSaved }: { onSaved: () => void }) {
  // Full-day off form
  const [dayOffDate, setDayOffDate] = useState("");
  const [dayOffReason, setDayOffReason] = useState("");
  const [dayOffBusy, setDayOffBusy] = useState(false);

  // Time-range form
  const [rangeDate, setRangeDate] = useState("");
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");
  const [rangeReason, setRangeReason] = useState("");
  const [rangeBusy, setRangeBusy] = useState(false);

  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function blockFullDay(e: React.FormEvent) {
    e.preventDefault();
    if (!dayOffDate) return;
    setDayOffBusy(true);
    setMsg(null);
    try {
      await api.addBlockedPeriod({ block_date: dayOffDate, is_full_day: true, reason: dayOffReason });
      setDayOffDate("");
      setDayOffReason("");
      setMsg({ ok: true, text: `${fmtDate(dayOffDate)} marked as a day off. All slots on that day are now blocked.` });
      onSaved();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Failed to block day." });
    } finally {
      setDayOffBusy(false);
    }
  }

  async function blockTimeRange(e: React.FormEvent) {
    e.preventDefault();
    if (!rangeDate || !rangeFrom || !rangeTo) return;
    setRangeBusy(true);
    setMsg(null);
    try {
      await api.addBlockedPeriod({
        block_date: rangeDate,
        is_full_day: false,
        start_time: rangeFrom,
        end_time: rangeTo,
        reason: rangeReason,
      });
      setRangeDate("");
      setRangeFrom("");
      setRangeTo("");
      setRangeReason("");
      setMsg({ ok: true, text: `Slots between ${rangeFrom}–${rangeTo} on ${fmtDate(rangeDate)} are now blocked.` });
      onSaved();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Failed to block hours." });
    } finally {
      setRangeBusy(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
      {/* Card: Full day off */}
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-4 shadow-card sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <FaCalendarTimes />
          </span>
          <div>
            <p className="font-bold text-secondary">Full Day Off</p>
            <p className="text-xs text-slate-400">All slots on this date will be blocked</p>
          </div>
        </div>
        <form onSubmit={blockFullDay} className="space-y-3">
          <div>
            <label htmlFor="dayoff-date" className="label">Date</label>
            <input
              id="dayoff-date"
              required
              type="date"
              min={today}
              value={dayOffDate}
              onChange={(e) => setDayOffDate(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="dayoff-reason" className="label">Reason (optional)</label>
            <input
              id="dayoff-reason"
              type="text"
              placeholder="e.g. Public holiday, Staff training…"
              value={dayOffReason}
              onChange={(e) => setDayOffReason(e.target.value)}
              className="input"
            />
          </div>
          <button
            type="submit"
            disabled={dayOffBusy || !dayOffDate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
          >
            <FaCalendarTimes /> {dayOffBusy ? "Blocking…" : "Mark Day as Off"}
          </button>
        </form>
      </div>

      {/* Card: Specific hours off */}
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-4 shadow-card sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <FaClock />
          </span>
          <div>
            <p className="font-bold text-secondary">Block Specific Hours</p>
            <p className="text-xs text-slate-400">e.g. lunch break, meeting, personal leave</p>
          </div>
        </div>
        <form onSubmit={blockTimeRange} className="space-y-3">
          <div>
            <label htmlFor="range-date" className="label">Date</label>
            <input
              id="range-date"
              required
              type="date"
              min={today}
              value={rangeDate}
              onChange={(e) => setRangeDate(e.target.value)}
              className="input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="range-from" className="label">From</label>
              <input
                id="range-from"
                required
                type="time"
                value={rangeFrom}
                onChange={(e) => setRangeFrom(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="range-to" className="label">To</label>
              <input
                id="range-to"
                required
                type="time"
                value={rangeTo}
                onChange={(e) => setRangeTo(e.target.value)}
                className="input"
              />
            </div>
          </div>
          <div>
            <label htmlFor="range-reason" className="label">Reason (optional)</label>
            <input
              id="range-reason"
              type="text"
              placeholder="e.g. Lunch break, Staff meeting…"
              value={rangeReason}
              onChange={(e) => setRangeReason(e.target.value)}
              className="input"
            />
          </div>
          <button
            type="submit"
            disabled={rangeBusy || !rangeDate || !rangeFrom || !rangeTo}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
          >
            <FaClock /> {rangeBusy ? "Blocking…" : "Block These Hours"}
          </button>
        </form>
      </div>

      {msg && (
        <div className={`lg:col-span-2 rounded-xl px-4 py-3 text-sm font-medium ${msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
          {msg.text}
        </div>
      )}
    </div>
  );
}

// ─────────────── Section 3: Active Blocks list ───────────────
function ActiveBlocksSection({
  periods,
  onDeleted,
  setModal,
}: {
  periods: BlockedPeriod[];
  onDeleted: () => void;
  setModal: (p: ConfirmModalProps | null) => void;
}) {
  const [deleting, setDeleting] = useState<number | null>(null);

  function remove(id: number) {
    setModal({
      title: "Remove Block",
      message: "Remove this time-off block? Existing blocked slots will be re-opened.",
      confirmLabel: "Remove",
      type: "danger",
      onConfirm: async () => {
        setModal(null);
        setDeleting(id);
        await api.deleteBlockedPeriod(id);
        setDeleting(null);
        onDeleted();
      },
      onCancel: () => setModal(null),
    });
  }

  if (periods.length === 0) {
    return (
      <div className="py-12 text-center">
        <MdOutlineEventBusy className="mx-auto text-5xl text-slate-200" />
        <p className="mt-3 text-slate-400">No time-off blocks yet.</p>
        <p className="text-sm text-slate-400">Use the &ldquo;Block Time Off&rdquo; tab to add some.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {periods.map((bp) => (
        <div
          key={bp.id}
          className={`flex flex-wrap items-center gap-3 rounded-2xl border px-3 py-3 sm:flex-nowrap sm:gap-4 sm:px-4 ${
            bp.is_full_day
              ? "border-rose-100 bg-rose-50"
              : "border-amber-100 bg-amber-50"
          }`}
        >
          {/* Icon */}
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
              bp.is_full_day ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
            }`}
          >
            {bp.is_full_day ? <FaCalendarTimes /> : <FaClock />}
          </span>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-secondary">{fmtDate(bp.block_date)}</p>
            <p className="text-sm text-slate-500">
              {bp.is_full_day ? (
                <span className="inline-flex items-center gap-1">
                  <FaBan className="text-rose-400" /> Full day off
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <FaClock className="text-amber-400" /> {bp.start_time} – {bp.end_time}
                </span>
              )}
              {bp.reason && (
                <span className="ml-2 text-slate-400">— {bp.reason}</span>
              )}
            </p>
          </div>

          {/* Badge */}
          <span
            className={`hidden shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold sm:block ${
              bp.is_full_day ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-700"
            }`}
          >
            {bp.is_full_day ? "Day Off" : "Hours Blocked"}
          </span>

          {/* Delete */}
          <button
            type="button"
            onClick={() => remove(bp.id)}
            disabled={deleting === bp.id}
            title="Remove block"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white hover:text-rose-500 disabled:opacity-40"
          >
            <FaTrashAlt />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─────────────── Section: Daily Breaks ───────────────
function DailyBreaksSection({ setModal }: { setModal: (p: ConfirmModalProps | null) => void }) {
  const [breaks, setBreaks] = useState<RecurringBreak[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function load() {
    setLoading(true);
    setBreaks(await api.getRecurringBreaks());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function addBreak(e: React.FormEvent) {
    e.preventDefault();
    if (!fromTime || !toTime) return;
    setSaving(true);
    setMsg(null);
    try {
      await api.addRecurringBreak({ start_time: fromTime, end_time: toTime, reason });
      setFromTime(""); setToTime(""); setReason("");
      setMsg({ ok: true, text: `Break ${fromTime}–${toTime} added. Existing slots in this window are now blocked.` });
      load();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Failed to add break." });
    } finally {
      setSaving(false);
    }
  }

  async function toggle(rb: RecurringBreak) {
    setToggling(rb.id);
    await api.toggleRecurringBreak(rb.id, !rb.is_active);
    setToggling(null);
    load();
  }

  function remove(id: number) {
    setModal({
      title: "Delete Break",
      message: "Delete this daily break? Slots in this window will be re-opened.",
      confirmLabel: "Delete",
      type: "danger",
      onConfirm: async () => {
        setModal(null);
        setDeleting(id);
        await api.deleteRecurringBreak(id);
        setDeleting(null);
        load();
      },
      onCancel: () => setModal(null),
    });
  }

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <FaClock className="mt-0.5 shrink-0 text-amber-500" />
        <p>
          Daily breaks repeat <strong>every working day</strong> automatically — perfect for lunch,
          prayers, or any regular gap. Patients will never see slots during these hours.
          Toggle a break on/off without deleting it.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Add form */}
        <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/40 p-5 shadow-card">
          <p className="mb-4 flex items-center gap-2 font-bold text-secondary">
            <FaClock className="text-amber-500" /> Add a Daily Break
          </p>
          <form onSubmit={addBreak} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="brk-from" className="label">From</label>
                <input
                  id="brk-from"
                  required
                  type="time"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="brk-to" className="label">To</label>
                <input
                  id="brk-to"
                  required
                  type="time"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                  className="input"
                />
              </div>
            </div>
            <div>
              <label htmlFor="brk-reason" className="label">Label (optional)</label>
              <input
                id="brk-reason"
                type="text"
                placeholder="e.g. Lunch break, Prayer time…"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="input"
              />
            </div>
            <button
              type="submit"
              disabled={saving || !fromTime || !toTime}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
            >
              <FaClock /> {saving ? "Adding…" : "Add Daily Break"}
            </button>
          </form>
          {msg && (
            <p className={`mt-3 rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
              {msg.text}
            </p>
          )}
        </div>

        {/* Break list */}
        <div className="space-y-3">
          <p className="font-bold text-secondary">Current Daily Breaks</p>
          {loading ? (
            <p className="text-sm text-slate-400">Loading…</p>
          ) : breaks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center">
              <FaClock className="mx-auto text-3xl text-slate-200" />
              <p className="mt-2 text-sm text-slate-400">No daily breaks set</p>
            </div>
          ) : (
            breaks.map((rb) => (
              <div
                key={rb.id}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
                  rb.is_active
                    ? "border-amber-200 bg-amber-50"
                    : "border-slate-200 bg-slate-50 opacity-60"
                }`}
              >
                {/* Icon */}
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm ${rb.is_active ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400"}`}>
                  <FaClock />
                </span>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-secondary">
                    {rb.start_time} – {rb.end_time}
                  </p>
                  <p className="text-xs text-slate-400">
                    {rb.reason || "Daily break"} &nbsp;·&nbsp;
                    <span className={rb.is_active ? "text-emerald-600" : "text-slate-400"}>
                      {rb.is_active ? "Active every day" : "Paused"}
                    </span>
                  </p>
                </div>

                {/* Toggle */}
                <button
                  type="button"
                  onClick={() => toggle(rb)}
                  disabled={toggling === rb.id}
                  title={rb.is_active ? "Pause break" : "Activate break"}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-40 ${
                    rb.is_active ? "bg-amber-400" : "bg-slate-300"
                  }`}
                  aria-label={rb.is_active ? "Deactivate break" : "Activate break"}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      rb.is_active ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => remove(rb.id)}
                  disabled={deleting === rb.id}
                  title="Delete break"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-rose-500 disabled:opacity-40"
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────── Main Panel ───────────────
type PanelTab = "schedule" | "breaks" | "timeoff" | "blocks";

export function AvailabilityPanel() {
  const [tab, setTab] = useState<PanelTab>("schedule");
  const [blockedPeriods, setBlockedPeriods] = useState<BlockedPeriod[]>([]);
  const [modal, setModal] = useState<ConfirmModalProps | null>(null);

  async function loadBlocks() {
    const data = await api.getBlockedPeriods();
    setBlockedPeriods(data);
  }
  useEffect(() => { loadBlocks(); }, []);

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-card">
        <div className="border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="text-base font-bold text-secondary sm:text-lg">Manage Availability</h2>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            Control which days and hours patients can book appointments.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none sm:flex-wrap sm:overflow-visible sm:px-6 sm:py-4">
          <Tab active={tab === "schedule"} onClick={() => setTab("schedule")}>
            <MdSchedule className="text-base" /> Weekly Schedule
          </Tab>
          <Tab active={tab === "breaks"} onClick={() => setTab("breaks")}>
            <FaClock className="text-base" /> Daily Breaks
          </Tab>
          <Tab active={tab === "timeoff"} onClick={() => setTab("timeoff")}>
            <MdToday className="text-base" /> Block Time Off
          </Tab>
          <Tab active={tab === "blocks"} onClick={() => setTab("blocks")}>
            <MdOutlineEventBusy className="text-base" />
            Active Blocks
            {blockedPeriods.length > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {blockedPeriods.length}
              </span>
            )}
          </Tab>
        </div>

        {/* Tab content */}
        <div className="px-3 pb-4 sm:px-6 sm:pb-6">
          {tab === "schedule" && <WeeklyScheduleSection />}
          {tab === "breaks" && <DailyBreaksSection setModal={setModal} />}
          {tab === "timeoff" && (
            <TimeOffSection
              onSaved={() => {
                loadBlocks();
                // Switch to Active Blocks tab so user sees the result
                setTab("blocks");
              }}
            />
          )}
          {tab === "blocks" && (
            <ActiveBlocksSection periods={blockedPeriods} onDeleted={loadBlocks} setModal={setModal} />
          )}
        </div>
      </div>

      {/* Help card */}
      <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-primary/5 to-secondary/5 px-4 py-3 shadow-card sm:px-6 sm:py-4">
        <p className="text-sm font-semibold text-secondary">How it works</p>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-500">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-primary/20 text-center text-[10px] font-bold leading-4 text-primary">1</span>
            Set your <strong>weekly schedule</strong> — which days the clinic is open and hours for each day. This repeats every week.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-primary/20 text-center text-[10px] font-bold leading-4 text-primary">2</span>
            Use <strong>Daily Breaks</strong> for recurring gaps — lunch, prayer time, meetings. They repeat every working day automatically. Toggle on/off anytime.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-primary/20 text-center text-[10px] font-bold leading-4 text-primary">3</span>
            Use <strong>Block Time Off</strong> for one-time exceptions: a public holiday, personal day, or ad-hoc unavailability.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-primary/20 text-center text-[10px] font-bold leading-4 text-primary">4</span>
            Blocked slots are <strong>hidden from patients</strong> — they will only see open, available times in the booking form.
          </li>
        </ul>
      </div>
    </div>

    {modal && <ConfirmModal {...modal} />}
    </>
  );
}
