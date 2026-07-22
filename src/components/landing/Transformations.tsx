"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { LuArrowRight, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { BookAppointmentButton } from "@/components/booking/BookAppointmentButton";
import { media } from "@/config/media";
import { trackButtonClick } from "@/lib/gtm";

const cases = media.transformations;

export function BeforeAfterSlider({ before, after, heightClass = "h-[340px]" }: { before: string; after: string; heightClass?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // Update CSS var directly — zero React re-renders during drag
  const move = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
    containerRef.current.style.setProperty("--split", `${pct}%`);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => { if (dragging.current) move(e.clientX); };
    const onMouseUp   = () => { dragging.current = false; };
    const onTouchMove = (e: TouchEvent) => { if (dragging.current) move(e.touches[0].clientX); };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend",  onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend",  onMouseUp);
    };
  }, [move]);

  return (
    <div
      ref={containerRef}
      className={`ba-slider relative select-none overflow-hidden rounded-2xl shadow-xl cursor-col-resize ${heightClass}`}
      style={{ "--split": "50%" } as React.CSSProperties}
    >
      {/* After image — base layer */}
      <Image src={after} alt="After" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />

      {/* Before image — GPU-composited clip, no layout triggered */}
      <Image
        src={before}
        alt="Before"
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
        style={{ clipPath: "inset(0 calc(100% - var(--split)) 0 0)" }}
      />

      <div className="absolute left-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">Before</div>
      <div className="absolute right-3 top-3 z-10 rounded-full bg-primary/90 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">After</div>

      <div className="ba-divider" style={{ left: "var(--split)" }} />

      <div
        className="ba-handle z-20"
        style={{ left: "var(--split)" }}
        onMouseDown={() => { dragging.current = true; }}
        onTouchStart={() => { dragging.current = true; }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M15 18l-6-6 6-6" /><path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </div>
  );
}

export function Transformations() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const touchX = useRef<number | null>(null);

  const go = useCallback((next: number, d: 1 | -1) => {
    setDir(d);
    setActive((next + cases.length) % cases.length);
  }, []);

  const prev = useCallback(() => go(active - 1, -1), [active, go]);
  const next = useCallback(() => go(active + 1, 1), [active, go]);

  // Swipe on the panel — the before/after slider handles its own drag
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const current = cases[active];

  return (
    <section ref={sectionRef} id="transformations" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[#1A2433]/92" />
      {/* Subtle bg pattern */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-secondary/15 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <div className="reveal mb-14 text-center">
          <div className="section-badge mb-5 inline-flex border-primary/30 bg-primary/15">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4DD4C5] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#4DD4C5]">Real Smile Transformations</span>
          </div>
          <h2 className="text-4xl font-extrabold leading-tight text-black/90 sm:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
            Real People.{" "}
            <span className="text-teal-gradient">Real Results.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-black/60" style={{ fontFamily: "var(--font-sans)" }}>
            Drag the slider to see the incredible transformations our patients experience.
          </p>
          <a
            href="/transformations"
            onClick={() => trackButtonClick("transformations_view_all")}
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e9b8d] transition-colors hover:text-[#0f7268]"
          >
            View All Transformations
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#1e9b8d]/30 bg-[#1e9b8d]/8">
              <LuArrowRight className="h-3 w-3" />
            </span>
          </a>
        </div>

        {/* Carousel */}
        <div className="reveal relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

          {/* Case title + counter */}
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="text-xs font-bold tabular-nums text-slate-400">
              {String(active + 1).padStart(2, "0")} / {String(cases.length).padStart(2, "0")}
            </span>
            <h3
              key={`title-${active}`}
              className="ba-slide text-center text-lg font-extrabold text-slate-800 sm:text-xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {current.label}
            </h3>
          </div>

          {/* Arrows — flank the slide on large screens, sit over its edges on small */}
          <button
            type="button"
            aria-label="Previous transformation"
            onClick={prev}
            className="absolute left-0 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary/20 bg-white/90 text-primary shadow-lg backdrop-blur transition-all hover:scale-110 hover:bg-primary hover:text-white lg:-left-4"
          >
            <LuChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next transformation"
            onClick={next}
            className="absolute right-0 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary/20 bg-white/90 text-primary shadow-lg backdrop-blur transition-all hover:scale-110 hover:bg-primary hover:text-white lg:-right-4"
          >
            <LuChevronRight className="h-5 w-5" />
          </button>

          {/* Slide — remounts per case so the enter animation replays */}
          <div
            key={active}
            className={`grid gap-10 px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-14 ${dir === 1 ? "ba-slide-in-right" : "ba-slide-in-left"}`}
          >
            <div>
              <BeforeAfterSlider before={current.before} after={current.after} heightClass="h-[220px] sm:h-[280px] md:h-[340px]" />
              <p className="mt-3 text-center text-xs text-slate-400" style={{ fontFamily: "var(--font-sans)" }}>
                <span className="hidden sm:inline">← Drag slider to compare →</span>
                <span className="sm:hidden">Touch &amp; drag to compare</span>
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
                <div className="mb-4 text-5xl text-primary">❝</div>
                <p className="mb-6 text-lg leading-relaxed text-black/80 italic" style={{ fontFamily: "var(--font-sans)" }}>
                  {current.quote}
                </p>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-[#4DD4C5]">
                    {current.tag}
                  </span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {cases.map((c, i) => (
              <button
                key={c.id}
                aria-label={`Go to ${c.label}`}
                onClick={() => go(i, i > active ? 1 : -1)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  active === i ? "w-7 bg-primary" : "w-2 bg-slate-300 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <BookAppointmentButton
              label={
                <span className="flex items-center gap-2">
                  Start My Transformation <LuArrowRight className="h-4 w-4" />
                </span>
              }
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-[0_8px_28px_rgba(30,155,141,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_12px_36px_rgba(30,155,141,0.55)]"
              trackingId="transformations_section"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
