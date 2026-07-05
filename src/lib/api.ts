/**
 * Thin API client for the FastAPI backend.
 * Base URL is configurable via NEXT_PUBLIC_API_BASE_URL.
 */
import type {
  Admin,
  AuthSession,
  BlockedPeriod,
  Booking,
  BookingListParams,
  PaginatedBookings,
  RecurringBreak,
  ScheduleDay,
  Slot,
} from "./types";
import type { SiteConfig } from "@/config/site.config";

const BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

const TOKEN_KEY = "astrale_admin_token";

export function saveSession(session: AuthSession) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, session.access_token);
    localStorage.setItem("astrale_admin_session", JSON.stringify(session));
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("astrale_admin_session");
  return raw ? (JSON.parse(raw) as AuthSession) : null;
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("astrale_admin_session");
  }
}

/** Decode the JWT exp claim and return true if the token has already expired. */
export function isSessionExpired(): boolean {
  const token = getToken();
  if (!token) return true;
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(b64));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

function redirectToLogin() {
  clearSession();
  if (typeof window !== "undefined") {
    window.location.href = "/admin/login";
  }
}

/** Build a friendly message from a 429 response's Retry-After header (seconds). */
function rateLimitMessage(res: Response): string {
  const retryAfter = Number(res.headers.get("Retry-After"));
  if (!retryAfter || retryAfter <= 0) {
    return "Too many attempts. Please try again shortly.";
  }
  const wait =
    retryAfter < 60
      ? `${retryAfter} second${retryAfter === 1 ? "" : "s"}`
      : `${Math.ceil(retryAfter / 60)} minute${Math.ceil(retryAfter / 60) === 1 ? "" : "s"}`;
  return `Too many attempts. Please try again in ${wait}.`;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // Skip ngrok's free-tier browser warning page (which has no CORS headers).
    "ngrok-skip-browser-warning": "true",
    ...(init.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...init, headers });

  if (res.status === 401) {
    redirectToLogin();
    throw new Error("Session expired. Please log in again.");
  }

  if (res.status === 429) {
    throw new Error(rateLimitMessage(res));
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      /* ignore */
    }
    throw new Error(typeof detail === "string" ? detail : "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  // ---- Public ----
  getConfig: () => request<SiteConfig>("/config"),
  getSlots: (date?: string, appointment_type?: string) => {
    const qs = new URLSearchParams();
    if (date) qs.set("date", date);
    if (appointment_type) qs.set("appointment_type", appointment_type);
    const q = qs.toString();
    return request<Slot[]>(`/slots${q ? `?${q}` : ""}`);
  },
  sendOtp: (phone: string) =>
    request<{ message: string }>("/otp/send", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),
  verifyOtp: (phone: string, code: string) =>
    request<{ token: string }>("/otp/verify", {
      method: "POST",
      body: JSON.stringify({ phone, code }),
    }),
  createBooking: (payload: {
    start_time: string | null;
    patient: { name: string; phone: string };
    appointment_type?: string;
    reason?: string;
    otp_token: string;
  }) =>
    request<Booking>("/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getBooking: (id: number) => request<Booking>(`/bookings/${id}`),

  // ---- Auth ----
  login: async (email: string, password: string): Promise<AuthSession> => {
    const form = new URLSearchParams();
    form.set("username", email);
    form.set("password", password);
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "ngrok-skip-browser-warning": "true",
      },
      body: form.toString(),
    });
    if (res.status === 429) throw new Error(rateLimitMessage(res));
    if (!res.ok) throw new Error("Incorrect email or password");
    return res.json();
  },

  // ---- Admin ----
  adminBookings: (params?: BookingListParams) => {
    const qs = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "" && v !== null) qs.set(k, String(v));
      });
    }
    const q = qs.toString();
    return request<PaginatedBookings>(`/admin/bookings${q ? `?${q}` : ""}`);
  },
  adminBookingsExport: async (params?: Omit<BookingListParams, "page" | "page_size">) => {
    const qs = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "" && v !== null) qs.set(k, String(v));
      });
    }
    const token = getToken();
    const res = await fetch(`${BASE}/admin/bookings/export?${qs}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.status === 401) { redirectToLogin(); throw new Error("Session expired."); }
    if (!res.ok) throw new Error("Export failed");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointments-${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  adminCancel: (id: number) =>
    request<Booking>(`/admin/bookings/${id}/cancel`, { method: "POST" }),
  adminSetStatus: (id: number, status: string) =>
    request<Booking>(`/admin/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  adminReschedule: (id: number, new_start_time: string) =>
    request<Booking>(`/admin/bookings/${id}/reschedule`, {
      method: "POST",
      body: JSON.stringify({ new_start_time }),
    }),

  // ---- Schedule & Availability ----
  getSchedule: () => request<ScheduleDay[]>("/admin/schedule"),
  saveSchedule: (days: Omit<ScheduleDay, "id">[]) =>
    request<ScheduleDay[]>("/admin/schedule", {
      method: "PUT",
      body: JSON.stringify({ days }),
    }),
  getBlockedPeriods: () => request<BlockedPeriod[]>("/admin/blocked-periods"),
  addBlockedPeriod: (payload: {
    block_date: string;
    is_full_day: boolean;
    start_time?: string;
    end_time?: string;
    reason?: string;
  }) =>
    request<BlockedPeriod>("/admin/blocked-periods", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  deleteBlockedPeriod: (id: number) =>
    request<void>(`/admin/blocked-periods/${id}`, { method: "DELETE" }),

  // ---- Recurring Breaks ----
  getRecurringBreaks: () => request<RecurringBreak[]>("/admin/recurring-breaks"),
  addRecurringBreak: (payload: { start_time: string; end_time: string; reason?: string }) =>
    request<RecurringBreak>("/admin/recurring-breaks", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  toggleRecurringBreak: (id: number, is_active: boolean) =>
    request<RecurringBreak>(`/admin/recurring-breaks/${id}/toggle?is_active=${is_active}`, {
      method: "PATCH",
    }),
  deleteRecurringBreak: (id: number) =>
    request<void>(`/admin/recurring-breaks/${id}`, { method: "DELETE" }),

  // ---- Profile ----
  updateProfile: (name: string) =>
    request<{ id: number; name: string; email: string }>("/admin/profile", {
      method: "PATCH",
      body: JSON.stringify({ name }),
    }),
  changePassword: (current_password: string, new_password: string) =>
    request<void>("/admin/profile/change-password", {
      method: "POST",
      body: JSON.stringify({ current_password, new_password }),
    }),
  changeEmail: (new_email: string, current_password: string) =>
    request<{ email: string }>("/admin/profile/change-email", {
      method: "POST",
      body: JSON.stringify({ new_email, current_password }),
    }),
};
