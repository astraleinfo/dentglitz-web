"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { BookingWidget } from "./BookingWidget";

/**
 * Drop-in "Book Appointment" button that opens the booking widget in a modal.
 * Use anywhere: <BookAppointmentButton label="Book Now" />
 */
export function BookAppointmentButton({
  label = "Book Appointment",
  className = "btn-primary",
}: {
  label?: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);       // controls DOM presence
  const [visible, setVisible] = useState(false); // controls CSS transition state
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setMounted(true), []);

  function openModal() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
    // Two rAFs ensure the element is in the DOM before the transition starts
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }

  function closeModal() {
    setVisible(false);
    closeTimer.current = setTimeout(() => setOpen(false), 300);
  }

  // Lock background scroll + close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const modal = (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300 ${
        visible ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0"
      }`}
      onClick={closeModal}
    >
      <div
        className={`flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-6 scale-[0.97] opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <BookingWidget onClose={closeModal} />
      </div>
    </div>
  );

  return (
    <>
      <button className={className} onClick={openModal}>
        {label}
      </button>
      {open && mounted && createPortal(modal, document.body)}
    </>
  );
}
