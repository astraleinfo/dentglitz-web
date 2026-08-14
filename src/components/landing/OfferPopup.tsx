"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import { LuArrowRight, LuGift } from "react-icons/lu";

import { BookingWidget } from "@/components/booking/BookingWidget";
import { trackButtonClick } from "@/lib/gtm";
import { media } from "@/config/media";

const offer = media.offerPopup;

function isLive() {
  if (!offer.enabled) return false;
  return new Date(`${offer.expiresOn}T23:59:59`).getTime() >= Date.now();
}

export function OfferPopup() {
  const [live, setLive]       = useState(false); // offer enabled & not expired
  const [open, setOpen]       = useState(false); // DOM presence
  const [visible, setVisible] = useState(false); // transition state
  const [booking, setBooking] = useState(false); // booking modal

  const show = useCallback(() => {
    setOpen(true);
    // Two rAFs ensure the element is in the DOM before the transition starts
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  // ── Auto-open after a short delay on every page load ──
  useEffect(() => {
    if (!isLive()) return;
    setLive(true);

    const timer = setTimeout(show, offer.delayMs);
    return () => clearTimeout(timer);
  }, [show]);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(() => setOpen(false), 280);
  }, []);

  // ── Lock background scroll + Escape to close ──
  useEffect(() => {
    if (!open && !booking) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (booking) setBooking(false);
      else close();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, booking, close]);

  function openBooking() {
    trackButtonClick(`offer_popup_book:${offer.id}`);
    close();
    setBooking(true);
  }

  // ─────────────────────────────────────────────────────────
  //  Offer modal — poster + book button, nothing else
  // ─────────────────────────────────────────────────────────
  const popup = (
    <div
      className={`fixed inset-0 z-[190] flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300 ${
        visible ? "bg-slate-950/65 opacity-100" : "bg-slate-950/0 opacity-0"
      }`}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={`${offer.eyebrow} — ${offer.title}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex max-h-[94vh] w-full max-w-[440px] flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl transition-all duration-300 ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-5 scale-[0.97] opacity-0"
        }`}
      >
        {/* Close */}
        <button
          type="button"
          onClick={close}
          aria-label="Close offer"
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-md backdrop-blur transition hover:bg-white hover:text-slate-900"
        >
          <FiX className="text-lg" />
        </button>

        {/* Poster */}
        <div className="min-h-0 flex-1">
          <Image
            src={offer.poster}
            alt={offer.posterAlt}
            width={1000}
            height={1500}
            priority
            className="h-full w-full object-contain"
          />
        </div>

        {/* Book Appointment */}
        <div className="shrink-0 border-t border-slate-100 bg-white p-4">
          <button type="button" onClick={openBooking} className="btn-primary w-full py-3 text-sm">
            Book Appointment <LuArrowRight />
          </button>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────
  //  Floating offer button — sits above the Call / WhatsApp stack
  // ─────────────────────────────────────────────────────────
  const floatingButton = (
    <button
      type="button"
      onClick={() => {
        trackButtonClick(`offer_popup_reopen:${offer.id}`);
        show();
      }}
      aria-label={`View offer — ${offer.title}`}
      className="group fixed bottom-[10.5rem] right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#f0b323] to-[#e07a1f] shadow-[0_8px_28px_rgba(224,122,31,0.5)] transition-all animate-glow-ring hover:scale-110 hover:shadow-[0_12px_40px_rgba(224,122,31,0.65)] lg:bottom-24"
    >
      <LuGift className="h-6 w-6 text-white" />

      {/* "New" ping dot */}
      <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
        <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-rose-500" />
      </span>

      {/* Hover label (desktop) */}
      <span className="pointer-events-none absolute right-[4.25rem] hidden whitespace-nowrap rounded-full bg-slate-900/85 px-3 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur transition group-hover:opacity-100 lg:block">
        {offer.eyebrow} — {offer.date}
      </span>
    </button>
  );

  // ─────────────────────────────────────────────────────────
  //  Booking modal (opened from the popup CTA)
  // ─────────────────────────────────────────────────────────
  const bookingModal = (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => setBooking(false)}
    >
      <div
        className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <BookingWidget onClose={() => setBooking(false)} />
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;

  return (
    <>
      {live && !open && createPortal(floatingButton, document.body)}
      {open          && createPortal(popup, document.body)}
      {booking       && createPortal(bookingModal, document.body)}
    </>
  );
}
