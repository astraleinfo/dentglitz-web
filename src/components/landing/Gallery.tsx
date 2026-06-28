"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LuX, LuArrowRight, LuZoomIn, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { media } from "@/config/media";

const categories = ["All", "Clinic Interior", "Treatments", "Equipment", "Happy Patients"];

// Landing section shows first 8 items with masonry spans
const landingSpans = ["col-span-2 row-span-2", "", "", "", "col-span-2", "", "", ""];
const galleryItems = media.galleryItems.slice(0, 8).map((item, i) => ({
  ...item,
  span: landingSpans[i] ?? "",
}));

export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxVisible, setLightboxVisible] = useState(false);

  const filtered = activeCategory === "All"
    ? galleryItems
    : galleryItems.filter((item) => item.cat === activeCategory);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    sectionRef.current?.querySelectorAll(".reveal, .reveal-zoom").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [activeCategory]);

  function openLightbox(index: number) {
    setLightboxIndex(index);
    requestAnimationFrame(() => requestAnimationFrame(() => setLightboxVisible(true)));
  }

  function closeLightbox() {
    setLightboxVisible(false);
    setTimeout(() => setLightboxIndex(null), 300);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i !== null && i < filtered.length - 1 ? i + 1 : i));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length]);

  // Spans only apply in "All" view — filtered views use a uniform grid to avoid white gaps
  const useSpans = activeCategory === "All";
  const lightboxItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <section ref={sectionRef} id="gallery" className="relative overflow-hidden scroll-mt-28 py-20 lg:py-28">
      {/* Semi-transparent overlay over fixed page background */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

      {/* Glow blobs — matching About section */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#4DD4C5]/12 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#2a487e]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="reveal mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1e9b8d]/30 bg-[#1e9b8d]/8 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#1e9b8d] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1e9b8d]">
                Gallery
              </span>
            </div>

            {/* Heading */}
            <h2
              className="mb-3 text-4xl font-extrabold leading-[1.12] text-[#071224] xl:text-[2.75rem]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              A Glimpse of{" "}
              <span className="bg-gradient-to-r from-[#1e9b8d] to-[#4DD4C5] bg-clip-text text-transparent">
                Our Clinic
              </span>
            </h2>

            {/* Teal accent line */}
            <div className="h-0.5 w-12 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#4DD4C5]" />
          </div>

          {/* View full gallery link */}
          <a
            href="/gallery"
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e9b8d] transition-colors hover:text-[#0f7268]"
          >
            View Full Gallery
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#1e9b8d]/30 bg-[#1e9b8d]/8">
              <LuArrowRight className="h-3 w-3" />
            </span>
          </a>
        </div>

        {/* ── Category filters ── */}
        <div className="reveal mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-[#1e9b8d] text-white shadow-[0_4px_16px_rgba(30,155,141,0.35)]"
                  : "border border-white/80 bg-white/65 text-slate-500 backdrop-blur-sm hover:border-[#1e9b8d]/30 hover:text-[#1e9b8d]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Gallery grid ──
            grid-flow-row-dense fills the gap created by col-span-2/row-span-2 items
            in the "All" view. Filtered views drop spans entirely (uniform grid).       */}
        <div className="grid auto-rows-[180px] grid-cols-2 gap-4 grid-flow-row-dense md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item, i) => (
            <div
              key={item.label + i}
              className={`reveal-zoom group relative cursor-pointer overflow-hidden rounded-2xl border border-white/80 shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-[#1e9b8d]/25 hover:shadow-[0_12px_40px_rgba(30,155,141,0.12)] ${useSpans ? item.span : ""}`}
              style={{ transitionDelay: `${i * 60}ms` }}
              onClick={() => openLightbox(i)}
            >
              <Image
                src={item.img}
                alt={item.label}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 50vw"
                priority={i < 2}
              />

              {/* Dark gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071224]/80 via-[#071224]/20 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

              {/* Label slides up on hover */}
              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-sm font-bold text-white">{item.label}</p>
                <p className="mt-0.5 text-[10px] text-white/65">{item.cat}</p>
              </div>

              {/* Zoom icon — top right */}
              <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <LuZoomIn className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxItem && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          onClick={closeLightbox}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-[#071224]/75 backdrop-blur-sm transition-opacity duration-300 ${lightboxVisible ? "opacity-100" : "opacity-0"}`}
          />

          {/* Panel */}
          <div
            className={`relative flex w-full max-w-3xl max-h-[88vh] flex-col overflow-hidden rounded-3xl bg-white
                       shadow-[0_8px_16px_rgba(0,0,0,0.08),_0_32px_80px_rgba(0,0,0,0.25)]
                       transition-all duration-300
                       ${lightboxVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-6"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient bar */}
            <div className="h-1 w-full flex-shrink-0 bg-gradient-to-r from-[#1e9b8d] to-[#2a487e]" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1e9b8d]/25 bg-[#1e9b8d]/8">
                  <LuZoomIn className="h-4 w-4 text-[#1e9b8d]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#071224]">{lightboxItem.label}</p>
                  <p className="text-[11px] text-slate-400">{lightboxItem.cat}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[#1e9b8d]/25 bg-[#1e9b8d]/8 px-3 py-1 text-[11px] font-bold text-[#1e9b8d]">
                  {lightboxIndex + 1} / {filtered.length}
                </span>
                <button
                  onClick={closeLightbox}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600"
                >
                  <LuX className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="relative flex-1 min-h-0 bg-slate-50 px-6 py-5">
              <Image
                src={lightboxItem.img}
                alt={lightboxItem.label}
                fill
                className="rounded-2xl object-contain p-2"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>

            {/* Footer: prev / dots / next */}
            <div className="flex-shrink-0 flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-6 py-4">
              <button
                onClick={() => setLightboxIndex(lightboxIndex - 1)}
                disabled={lightboxIndex === 0}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                  lightboxIndex > 0
                    ? "border-[#1e9b8d]/30 bg-[#1e9b8d]/8 text-[#1e9b8d] hover:bg-[#1e9b8d]/15"
                    : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                }`}
              >
                <LuChevronLeft className="h-4 w-4" /> Previous
              </button>

              <div className="flex gap-1.5">
                {filtered.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === lightboxIndex ? "h-2 w-5 bg-[#1e9b8d]" : "h-2 w-2 bg-slate-200 hover:bg-[#1e9b8d]/40"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setLightboxIndex(lightboxIndex + 1)}
                disabled={lightboxIndex === filtered.length - 1}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                  lightboxIndex < filtered.length - 1
                    ? "border-[#1e9b8d]/30 bg-[#1e9b8d]/8 text-[#1e9b8d] hover:bg-[#1e9b8d]/15"
                    : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                }`}
              >
                Next <LuChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
