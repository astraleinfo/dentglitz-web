"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { LuChevronLeft, LuChevronRight, LuGift, LuX } from "react-icons/lu";

import { api } from "@/lib/api";
import type { Banner } from "@/lib/types";

const SWIPE_PX = 40;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-dark";
const arrowClass = `h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 ${focusRing}`;

/** "banners/01-diwali-offer.webp" → "Diwali offer": file names double as alt text. */
function altFromKey(key: string): string {
  const name = (key.split("/").pop() ?? "")
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+[-_ ]*/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return name ? name[0].toUpperCase() + name.slice(1) : "Announcement";
}

/**
 * Promo banner popup, shown on page load when the API's S3 banner folder has
 * images. Several banners show as a carousel that auto-advances until the
 * visitor navigates. Once closed, a glowing "View Offer" button beside the
 * floating WhatsApp button reopens it. Nothing renders when there are no
 * banners or the request fails.
 *
 * Banners are posters with text baked in, so the image is always shown whole
 * and controls never sit on top of it — see `.banner-overlay` in globals.css
 * for how the image is sized to the viewport.
 */
export function BannerPopup() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loaded, setLoaded] = useState<Set<string>>(() => new Set());
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [closed, setClosed] = useState(false);
  const [mounted, setMounted] = useState(true); // overlay stays in the DOM through the close fade
  // Stays mounted once shown (the overlay covers it) so focus can return to it on close.
  const [showTrigger, setShowTrigger] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [autoplay, setAutoplay] = useState(true); // off after the first manual move
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const swiped = useRef(false);
  const unmountTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(unmountTimer.current), []);

  useEffect(() => {
    api
      .getBanners()
      .then(setBanners)
      .catch(() => {});
  }, []);

  const count = banners.length;
  const current = Math.min(index, count - 1);
  const multi = count > 1;

  const go = useCallback(
    (step: number) => setIndex((i) => (Math.min(i, count - 1) + step + count) % count),
    [count],
  );
  const navigate = useCallback(
    (step: number) => {
      setAutoplay(false);
      go(step);
    },
    [go],
  );

  const close = useCallback(() => {
    setClosed(true);
    setIsOpen(false);
    setHovered(false);
    setShowTrigger(true);
    unmountTimer.current = setTimeout(() => setMounted(false), 300);
  }, []);

  // The images are already loaded, so the open effect below shows it on the next frame.
  const reopen = () => {
    clearTimeout(unmountTimer.current);
    setIndex(0);
    setAutoplay(true);
    setMounted(true);
    setClosed(false);
  };

  // Open only once the first banner's image is ready, so the popup never flashes empty.
  useEffect(() => {
    if (closed || isOpen || count === 0 || !loaded.has(banners[current].key)) return;
    const frame = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(frame);
  }, [closed, isOpen, count, current, banners, loaded]);

  // While open: lock page scroll, move focus into the dialog and keep it there.
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbar}px`; // no layout jump when the scrollbar goes
    // focusVisible: false — the ring appears only once the visitor uses the keyboard.
    closeRef.current?.focus({ preventScroll: true, focusVisible: false } as FocusOptions);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (multi && e.key === "ArrowRight") navigate(1);
      else if (multi && e.key === "ArrowLeft") navigate(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>("button")].filter(
          (el) => el.offsetParent !== null,
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.removeEventListener("keydown", onKey);
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, [isOpen, multi, close, navigate]);

  if (count === 0) return null;

  // Mouse only: a tap would otherwise leave a sticky hover that pauses forever.
  const hover = {
    onPointerEnter: (e: PointerEvent) => e.pointerType === "mouse" && setHovered(true),
    onPointerLeave: (e: PointerEvent) => e.pointerType === "mouse" && setHovered(false),
  };

  const arrow = (step: -1 | 1, display: string) => (
    <button
      type="button"
      onClick={() => navigate(step)}
      aria-label={step < 0 ? "Previous banner" : "Next banner"}
      className={`${arrowClass} ${display}`}
    >
      {step < 0 ? <LuChevronLeft className="h-5 w-5" /> : <LuChevronRight className="h-5 w-5" />}
    </button>
  );

  const overlay = (
    <div
      ref={dialogRef}
      data-multi={multi || undefined}
      className={`banner-overlay fixed inset-0 z-[200] flex flex-col items-center justify-center ${isOpen ? "" : "pointer-events-none"}`}
      onClick={() => {
        if (swiped.current) swiped.current = false;
        else close();
      }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (multi && Math.abs(dx) > SWIPE_PX) {
          swiped.current = true;
          navigate(dx < 0 ? 1 : -1);
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={multi ? "Announcements" : "Announcement"}
      {...(multi && { "aria-roledescription": "carousel" })}
    >
      <div
        className={`absolute inset-0 bg-secondary-dark/90 backdrop-blur-md transition-opacity duration-300 motion-reduce:transition-none ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      <div
        className={`relative flex items-center gap-3 transition duration-300 ease-out motion-reduce:transition-none
                   ${isOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.97] opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {multi && arrow(-1, "hidden short:flex")}

        <div className="relative" {...hover}>
          {/* Every banner is mounted so the rest preload; only the current one is
              displayed, and it fades in when it changes. Plain <img>: the
              presigned S3 URLs aren't in next.config's remotePatterns. */}
          {banners.map((b, i) => (
            <img
              key={b.key}
              src={b.image_url}
              alt={altFromKey(b.key)}
              className={
                i === current
                  ? "banner-img block h-auto w-auto rounded-xl object-contain shadow-[0_24px_64px_-12px_rgba(0,0,0,0.5)] animate-[banner-in_300ms_ease-out] motion-reduce:animate-none sm:rounded-2xl"
                  : "hidden"
              }
              onLoad={() => setLoaded((s) => new Set(s).add(b.key))}
              onError={() => setBanners((bs) => bs.filter((x) => x.key !== b.key))}
            />
          ))}

          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close"
            className={`absolute -right-3 -top-3 short:right-2 short:top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-secondary shadow-lg transition-colors hover:bg-slate-100 ${focusRing}`}
          >
            <LuX className="h-5 w-5" />
          </button>
        </div>

        {multi && arrow(1, "hidden short:flex")}
      </div>

      {multi && (
        <div
          className={`relative mt-3 flex items-center gap-2 transition-opacity duration-300 motion-reduce:transition-none short:hidden ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={(e) => e.stopPropagation()}
          {...hover}
        >
          {arrow(-1, "flex")}
          <div className="flex items-center px-1">
            {banners.map((b, i) => {
              const active = i === current;
              return (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => {
                    setAutoplay(false);
                    setIndex(i);
                  }}
                  aria-label={`Show banner ${i + 1} of ${count}`}
                  aria-current={active}
                  className={`group flex h-11 items-center rounded-full px-1.5 ${focusRing}`}
                >
                  <span
                    className={`relative block h-1.5 overflow-hidden rounded-full transition-[width,background-color] duration-300
                               ${active ? "w-8 bg-white/25" : "w-1.5 bg-white/45 group-hover:bg-white/80"}`}
                  >
                    {/* The active dot fills over the auto-advance interval, and
                        advances when the fill completes — so pausing the
                        animation (hover) pauses the carousel too. With reduced
                        motion there's no animation, so no auto-advance. */}
                    {active && (
                      <span
                        className={`absolute inset-0 origin-left rounded-full bg-primary
                                   ${autoplay ? "animate-[banner-progress_6s_linear_forwards] motion-reduce:animate-none" : ""}
                                   ${autoplay && (hovered || !isOpen) ? "[animation-play-state:paused]" : ""}`}
                        onAnimationEnd={() => go(1)}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          {arrow(1, "flex")}
        </div>
      )}
    </div>
  );

  return (
    <>
      {mounted && overlay}

      {/* Same design as the Aug 15 offer button (offer-aug-15 branch): tops the
          floating stack in Hero.tsx — above Call on mobile, and above WhatsApp on
          desktop, where the Call button is hidden. */}
      {showTrigger && (
        <button
          type="button"
          onClick={reopen}
          aria-label={multi ? "View offers" : "View offer"}
          aria-haspopup="dialog"
          className="group fixed bottom-[10.5rem] right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full
                     bg-gradient-to-br from-[#f0b323] to-[#e07a1f] shadow-[0_8px_28px_rgba(224,122,31,0.5)]
                     transition-all animate-glow-ring hover:scale-110 hover:shadow-[0_12px_40px_rgba(224,122,31,0.65)]
                     motion-reduce:animate-none focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-[#e07a1f] focus-visible:ring-offset-2 lg:bottom-24"
        >
          <LuGift className="h-6 w-6 text-white" />

          {/* "New" ping dot */}
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-rose-500" />
          </span>

          {/* Hover label (desktop) */}
          <span className="pointer-events-none absolute right-[4.25rem] hidden whitespace-nowrap rounded-full bg-slate-900/85 px-3 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus-visible:opacity-100 lg:block">
            {multi ? "View offers" : "View offer"}
          </span>
        </button>
      )}
    </>
  );
}
