"use client";

import { forwardRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import DatePicker from "react-datepicker";
import {
  LuCalendarCheck2, LuCalendar, LuCalendarDays, LuCircleX,
  LuPhone, LuX, LuSearch, LuFilter, LuDownload, LuClock,
  LuChevronLeft, LuChevronRight, LuChevronUp, LuChevronDown,
  LuChevronsUpDown, LuCalendarRange,
} from "react-icons/lu";

import { api } from "@/lib/api";
import type { AppointmentType, Booking, BookingListParams, PaginatedBookings, Slot } from "@/lib/types";
import { Avatar, StatCard, StatusPill, PanelCard } from "@/components/admin/ui";
import { ConfirmModal, type ConfirmModalProps } from "@/components/admin/ConfirmModal";

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  });

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

const isToday = (iso: string) =>
  new Date(iso).toDateString() === new Date().toDateString();

/** Format a Date as YYYY-MM-DD in local time (avoids UTC off-by-one). */
const toLocalDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const APPT_TYPE_LABEL: Record<AppointmentType, string> = {
  general:  "General",
  extended: "Extended",
};

type SortCol = "start_time" | "created_at" | "patient_name" | "status";

const PAGE_SIZES = [10, 20, 50, 100];

export function BookingsPanel() {
  const [data, setData] = useState<PaginatedBookings | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Separate draft state for search (debounced)
  const [searchDraft, setSearchDraft] = useState("");

  const [params, setParams] = useState<BookingListParams>({
    search: "",
    status: "",
    start_date: toLocalDate(new Date()),
    end_date: toLocalDate(new Date()),
    sort_by: "start_time",
    sort_order: "asc",
    page: 1,
    page_size: 20,
  });

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(), new Date()]);

  const [rescheduling, setRescheduling] = useState<Booking | null>(null);
  const [modal, setModal] = useState<ConfirmModalProps | null>(null);

  // Debounce search input → update params.search
  useEffect(() => {
    const t = setTimeout(() => {
      setParams((p) => ({ ...p, search: searchDraft, page: 1 }));
    }, 400);
    return () => clearTimeout(t);
  }, [searchDraft]);

  // Fetch whenever params change
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const result = await api.adminBookings(params);
        if (!cancelled) setData(result);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [params]);

  function setFilter(key: keyof BookingListParams, value: string | number) {
    setParams((p) => ({ ...p, [key]: value, page: 1 }));
  }

  function toggleSort(col: SortCol) {
    setParams((p) => ({
      ...p,
      sort_by: col,
      sort_order: p.sort_by === col && p.sort_order === "desc" ? "asc" : "desc",
      page: 1,
    }));
  }

  function handleDateRangeChange(range: [Date | null, Date | null]) {
    setDateRange(range);
    const [start, end] = range;
    setParams((p) => ({
      ...p,
      start_date: start ? toLocalDate(start) : "",
      end_date: end ? toLocalDate(end) : "",
      page: 1,
    }));
  }

  function clearFilters() {
    setSearchDraft("");
    setDateRange([null, null]);
    setParams((p) => ({
      ...p,
      search: "",
      status: "",
      start_date: "",
      end_date: "",
      page: 1,
    }));
  }

  function cancel(b: Booking) {
    setModal({
      title: "Cancel Appointment",
      message: `Cancel ${b.patient.name}'s appointment on ${new Date(b.start_time).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}?`,
      confirmLabel: "Yes, Cancel",
      type: "danger",
      onConfirm: async () => {
        setModal(null);
        await api.adminCancel(b.id);
        setParams((p) => ({ ...p })); // trigger refetch
      },
      onCancel: () => setModal(null),
    });
  }

  async function handleExport() {
    setExporting(true);
    try {
      await api.adminBookingsExport({
        search: params.search,
        status: params.status,
        start_date: params.start_date,
        end_date: params.end_date,
        sort_by: params.sort_by,
        sort_order: params.sort_order,
      });
    } finally {
      setExporting(false);
    }
  }

  const hasFilters = !!(params.search || params.status || params.start_date || params.end_date);
  const stats = data?.stats;
  const items = data?.items ?? [];

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard icon={LuCalendarCheck2} label="Total bookings"  value={stats?.all_count       ?? "—"} tone="secondary" />
        <StatCard icon={LuCalendar}       label="Confirmed"        value={stats?.confirmed_count ?? "—"} tone="primary" />
        <StatCard icon={LuCalendarDays}   label="Today"            value={stats?.today_count     ?? "—"} tone="amber" />
        <StatCard icon={LuCircleX}        label="Cancelled"        value={stats?.cancelled_count ?? "—"} tone="rose" />
      </div>

      {/* Table card */}
      <PanelCard>
        {/* ── Card header ── */}
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
          {/* Row 1: title + export */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-secondary">All Appointments</h2>
              <p className="mt-0.5 text-xs text-slate-400">
                {loading ? "Loading…" : `${data?.total ?? 0} result${data?.total !== 1 ? "s" : ""}`}
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting || loading}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white disabled:opacity-50"
            >
              <LuDownload className={`text-sm ${exporting ? "animate-bounce" : ""}`} />
              {exporting ? "Exporting…" : "Excel"}
            </button>
          </div>

          {/* Row 2: filters — search full-width on mobile, rest on second row */}
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            {/* Search — full width on mobile */}
            <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-[220px]">
              <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-slate-400" />
              <input
                placeholder="Name, phone, ID…"
                aria-label="Search patients"
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
              />
            </div>

            {/* Second row on mobile: status + date + clear — never wraps */}
            <div className="flex items-center gap-2">
              {/* Status — shrinks to content */}
              <div className="relative shrink-0">
                <LuFilter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-slate-400" />
                <select
                  aria-label="Filter by status"
                  value={params.status}
                  onChange={(e) => setFilter("status", e.target.value)}
                  className="appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-6 text-sm text-slate-700 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
                >
                  <option value="">All status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
              </div>

              {/* Date range picker — flex-1 so it fills remaining space */}
              <div className="min-w-0 flex-1 overflow-hidden">
                <DatePicker
                  selectsRange
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  onChange={handleDateRangeChange}
                  customInput={<DateRangeInput hasValue={!!(dateRange[0] || dateRange[1])} />}
                  dateFormat="d MMM"
                  placeholderText="Date range"
                  monthsShown={1}
                  calendarStartDay={1}
                  popperPlacement="bottom-start"
                />
              </div>

              {/* Clear filters — shrinks to content */}
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex h-[38px] shrink-0 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 hover:border-rose-300"
                >
                  <LuX className="text-sm" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <LuCalendar className="mx-auto text-5xl text-slate-200" />
            <p className="mt-3 font-medium text-slate-400">No appointments found</p>
            <p className="mt-1 text-sm text-slate-300">
              {hasFilters ? "Try adjusting your filters" : "No bookings yet"}
            </p>
          </div>
        ) : (
          <>
            {/* ── Desktop table ── */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <SortTh col="patient_name" label="Patient"     params={params} onSort={toggleSort} />
                    <th className="border-b-2 border-slate-200 px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Phone</th>
                    <th className="border-b-2 border-slate-200 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Type</th>
                    <SortTh col="start_time"   label="Appointment" params={params} onSort={toggleSort} />
                    <SortTh col="status"       label="Status"      params={params} onSort={toggleSort} />
                    <SortTh col="created_at"   label="Booked On"   params={params} onSort={toggleSort} />
                    <th className="border-b-2 border-slate-200 px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((b) => {
                    const today = isToday(b.start_time);
                    return (
                      <tr
                        key={b.id}
                        className={`transition-colors hover:bg-slate-50 ${
                          today && b.status === "confirmed" ? "bg-primary/[0.04]" : ""
                        }`}
                      >
                        {/* Patient */}
                        <td className={`py-4 pr-6 ${today && b.status === "confirmed" ? "border-l-4 border-primary pl-[20px]" : "pl-6"}`}>
                          <div className="flex items-center gap-3">
                            <Avatar name={b.patient.name} size={36} />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-secondary">{b.patient.name}</span>
                                {today && b.status === "confirmed" && (
                                  <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">TODAY</span>
                                )}
                              </div>
                              <div className="mt-0.5 text-xs text-slate-400">
                                {b.reason || "General visit"} · #{b.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <LuPhone className="text-xs text-primary" />
                            <span className="text-sm">{b.patient.phone}</span>
                          </div>
                        </td>

                        {/* Appointment Type */}
                        <td className="px-4 py-4">
                          <ApptTypePill type={b.appointment_type} startTime={b.start_time} endTime={b.end_time} />
                        </td>

                        {/* Appointment */}
                        <td className="px-6 py-4">
                          <div className="font-medium text-secondary">{fmtDate(b.start_time)}</div>
                          <div className="text-xs text-slate-400">{fmtTime(b.start_time)}</div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <StatusPill status={b.status} />
                        </td>

                        {/* Booked On */}
                        <td className="px-6 py-4 text-xs text-slate-400">
                          {fmtDate(b.created_at)}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          {b.status !== "cancelled" && (
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setRescheduling(b)}
                                className="rounded-lg border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                              >
                                Reschedule
                              </button>
                              <button
                                type="button"
                                onClick={() => cancel(b)}
                                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-500 transition hover:bg-rose-500 hover:text-white"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Mobile card layout ── */}
            <div className="divide-y divide-slate-200 lg:hidden">
              {items.map((b) => {
                const today = isToday(b.start_time);
                return (
                  <div
                    key={b.id}
                    className={`p-4 ${today && b.status === "confirmed" ? "border-l-4 border-primary bg-primary/[0.04] pl-3" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar name={b.patient.name} size={40} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-secondary">{b.patient.name}</span>
                          {today && b.status === "confirmed" && (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">TODAY</span>
                          )}
                          <StatusPill status={b.status} />
                        </div>
                        <p className="mt-0.5 text-xs text-slate-400">{b.reason || "General visit"} · #{b.id}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <LuCalendar className="shrink-0 text-xs text-primary" />
                        {fmtDate(b.start_time)}, {fmtTime(b.start_time)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <LuPhone className="shrink-0 text-xs text-primary" />
                        {b.patient.phone}
                      </span>
                      <ApptTypePill type={b.appointment_type} startTime={b.start_time} endTime={b.end_time} />
                    </div>
                    {b.status !== "cancelled" && (
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setRescheduling(b)}
                          className="flex-1 rounded-lg border border-primary/20 bg-primary/8 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                        >
                          Reschedule
                        </button>
                        <button
                          type="button"
                          onClick={() => cancel(b)}
                          className="flex-1 rounded-lg border border-rose-100 bg-rose-50 py-2 text-xs font-semibold text-rose-500 transition hover:bg-rose-500 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── Pagination ── */}
        {data && data.pages > 0 && !loading && (
          <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:px-6">
            {/* Left: showing info + page size */}
            <div className="flex items-center gap-3">
              <p className="text-xs text-slate-400">
                {data.total === 0
                  ? "No results"
                  : `Showing ${(data.page - 1) * data.page_size + 1}–${Math.min(data.page * data.page_size, data.total)} of ${data.total}`}
              </p>
              <select
                aria-label="Items per page"
                value={params.page_size}
                onChange={(e) => { setFilter("page_size", Number(e.target.value)); }}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              >
                {PAGE_SIZES.map((n) => (
                  <option key={n} value={n}>{n} / page</option>
                ))}
              </select>
            </div>

            {/* Right: page buttons */}
            {data.pages > 1 && (
              <div className="flex items-center gap-1">
                <PageBtn
                  disabled={data.page <= 1}
                  onClick={() => setParams((p) => ({ ...p, page: p.page! - 1 }))}
                  aria-label="Previous page"
                >
                  <LuChevronLeft />
                </PageBtn>

                {buildPageNums(data.page, data.pages).map((n, i) =>
                  n === "…" ? (
                    <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-slate-300">…</span>
                  ) : (
                    <PageBtn
                      key={n}
                      active={n === data.page}
                      onClick={() => setParams((p) => ({ ...p, page: n as number }))}
                    >
                      {n}
                    </PageBtn>
                  )
                )}

                <PageBtn
                  disabled={data.page >= data.pages}
                  onClick={() => setParams((p) => ({ ...p, page: p.page! + 1 }))}
                  aria-label="Next page"
                >
                  <LuChevronRight />
                </PageBtn>
              </div>
            )}
          </div>
        )}
      </PanelCard>

      {rescheduling && (
        <RescheduleModal
          booking={rescheduling}
          onClose={() => setRescheduling(null)}
          onDone={() => {
            setRescheduling(null);
            setParams((p) => ({ ...p })); // trigger refetch
          }}
        />
      )}

      {modal && <ConfirmModal {...modal} />}
    </div>
  );
}

// ─── Appointment type pill ───
function ApptTypePill({
  type, startTime, endTime,
}: {
  type: AppointmentType;
  startTime: string;
  endTime: string;
}) {
  const label = APPT_TYPE_LABEL[type] ?? type;
  const durationMin = Math.round(
    (new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000
  );
  const isExtended = type === "extended";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        isExtended
          ? "bg-secondary/8 text-secondary ring-1 ring-secondary/20"
          : "bg-primary/8 text-primary ring-1 ring-primary/20"
      }`}
    >
      <LuClock className="text-[9px]" />
      {label} · {durationMin}m
    </span>
  );
}

// ─── Custom date range input trigger ───
const DateRangeInput = forwardRef<
  HTMLButtonElement,
  { value?: string; onClick?: () => void; hasValue?: boolean }
>(({ value, onClick, hasValue }, ref) => (
  <button
    type="button"
    ref={ref}
    onClick={onClick}
    className={`flex h-[38px] w-full min-w-0 items-center gap-2 overflow-hidden rounded-lg border px-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/15 ${
      hasValue
        ? "border-primary/30 bg-primary/5 text-slate-700 hover:border-primary/50"
        : "border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300"
    }`}
  >
    <LuCalendarRange className={`shrink-0 text-[14px] ${hasValue ? "text-primary" : "text-slate-400"}`} />
    <span className={`min-w-0 truncate ${hasValue ? "text-slate-700" : ""}`}>{value || "Date range"}</span>
  </button>
));
DateRangeInput.displayName = "DateRangeInput";

// ─── Sort column header ───
function SortTh({
  col, label, params, onSort,
}: {
  col: SortCol;
  label: string;
  params: BookingListParams;
  onSort: (col: SortCol) => void;
}) {
  const active = params.sort_by === col;
  return (
    <th
      className="cursor-pointer select-none border-b-2 border-slate-200 px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 transition hover:text-slate-600"
      onClick={() => onSort(col)}
    >
      <span className="flex items-center gap-1">
        {label}
        <span className={`text-[11px] ${active ? "text-primary" : "text-slate-300"}`}>
          {active
            ? params.sort_order === "desc"
              ? <LuChevronDown className="inline" />
              : <LuChevronUp className="inline" />
            : <LuChevronsUpDown className="inline opacity-50" />}
        </span>
      </span>
    </th>
  );
}

// ─── Page button ───
function PageBtn({
  children, active, disabled, onClick, "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex h-7 min-w-[28px] items-center justify-center rounded-md px-1.5 text-xs font-semibold transition ${
        active
          ? "bg-primary text-white shadow-sm"
          : disabled
          ? "cursor-not-allowed text-slate-300"
          : "text-slate-500 hover:bg-slate-100 hover:text-secondary"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Build page number list with ellipsis ───
function buildPageNums(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

// ─── Reschedule modal ───
function RescheduleModal({
  booking, onClose, onDone,
}: {
  booking: Booking;
  onClose: () => void;
  onDone: () => void;
}) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    api.getSlots(undefined, booking.appointment_type).then(setSlots);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [booking.appointment_type]);

  async function pick(startTime: string) {
    setBusy(true);
    await api.adminReschedule(booking.id, startTime);
    setBusy(false);
    onDone();
  }

  const byDay = slots.reduce((acc, s) => {
    const d = s.start_time.slice(0, 10);
    (acc[d] ||= []).push(s);
    return acc;
  }, {} as Record<string, Slot[]>);

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-secondary/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-h-[90vh] overflow-hidden rounded-t-2xl bg-white shadow-soft sm:max-w-lg sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Reschedule Appointment</p>
            <h3 className="mt-0.5 text-base font-bold text-secondary sm:text-lg">{booking.patient.name}</h3>
            <p className="text-xs text-slate-400">
              Currently: <b className="text-secondary">{fmtDateTime(booking.start_time)}</b>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            aria-label="Close"
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-secondary"
          >
            <LuX />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {Object.keys(byDay).length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">No open slots available.</div>
          ) : (
            Object.entries(byDay).map(([day, daySlots]) => (
              <div key={day} className="mb-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {new Date(day + "T00:00:00").toLocaleDateString(undefined, {
                    weekday: "long", day: "numeric", month: "short",
                  })}
                </p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {daySlots.map((s) => (
                    <button
                      key={s.start_time}
                      type="button"
                      disabled={busy}
                      onClick={() => pick(s.start_time)}
                      className="rounded-xl border border-slate-200 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:bg-primary hover:text-white disabled:opacity-40"
                    >
                      {new Date(s.start_time).toLocaleTimeString(undefined, {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(modal, document.body) : null;
}
