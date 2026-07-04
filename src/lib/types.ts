export type BookingStatus = "confirmed" | "cancelled" | "rescheduled" | "completed" | "no_show";
export type AppointmentType = "general" | "extended" | "emergency";
export type AdminRole = "super_admin" | "admin";

export interface Slot {
  start_time: string;
  end_time: string;
}

export interface Patient {
  id: number;
  name: string;
  phone: string;
}

export interface Booking {
  id: number;
  status: BookingStatus;
  appointment_type: AppointmentType;
  reason: string;
  notes: string;
  created_at: string;
  start_time: string;
  end_time: string;
  patient: Patient;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
}

export interface AuthSession {
  access_token: string;
  token_type: string;
  role: AdminRole;
  name: string;
  email: string;
}

export interface ScheduleDay {
  id: number;
  day_of_week: number;
  is_active: boolean;
  start_time: string;
  end_time: string;
}

export interface BlockedPeriod {
  id: number;
  block_date: string;
  is_full_day: boolean;
  start_time: string | null;
  end_time: string | null;
  reason: string;
  created_at: string;
}

export interface RecurringBreak {
  id: number;
  start_time: string;
  end_time: string;
  reason: string;
  is_active: boolean;
  created_at: string;
}

export interface BookingListParams {
  search?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

export interface BookingStats {
  all_count: number;
  confirmed_count: number;
  today_count: number;
  completed_count: number;
  no_show_count: number;
  cancelled_count: number;
}

export interface PaginatedBookings {
  items: Booking[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
  stats: BookingStats;
}
