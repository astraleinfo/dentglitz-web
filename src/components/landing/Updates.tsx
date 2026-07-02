"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LuCalendar, LuMapPin, LuArrowRight, LuUsers, LuTent, LuX } from "react-icons/lu";
import { media, type EventType, type UpdatePost } from "@/config/media";
import { trackButtonClick } from "@/lib/gtm";

// Landing section shows 4 most recent posts
const updates = media.updates.slice(0, 4);

const typeStyles: Record<EventType, { bg: string; text: string; icon: React.ReactNode }> = {
  Camp:     { bg: "bg-[#1e9b8d]/10 border-[#1e9b8d]/30", text: "text-[#1e9b8d]",  icon: <LuTent  className="h-3 w-3" /> },
  Event:    { bg: "bg-[#2a487e]/10 border-[#2a487e]/30", text: "text-[#2a487e]",  icon: <LuUsers className="h-3 w-3" /> },
  Workshop: { bg: "bg-amber-500/10 border-amber-400/30",  text: "text-amber-600", icon: <LuUsers className="h-3 w-3" /> },
};

export function Updates() {
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<"All" | EventType>("All");
  const [selectedPost, setSelectedPost] = useState<UpdatePost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback((post: UpdatePost) => {
    setSelectedPost(post);
    // Double RAF ensures element is in DOM before transition starts
    requestAnimationFrame(() => requestAnimationFrame(() => setIsModalOpen(true)));
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPost(null), 300);
  }, []);

  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [selectedPost, closeModal]);

  const filtered = filter === "All" ? updates : updates.filter((u) => u.type === filter);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.08 }
    );
    sectionRef.current?.querySelectorAll(".reveal, .reveal-zoom").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [filter]);

  return (
    <section ref={sectionRef} id="updates" className="relative overflow-hidden scroll-mt-28 py-20 lg:py-28">
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px]" />

      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#2a487e]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#4DD4C5]/12 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="reveal mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#2a487e]/30 bg-[#2a487e]/8 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#2a487e] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2a487e]">
                Updates
              </span>
            </div>

            <h2
              className="mb-3 text-4xl font-extrabold leading-[1.12] text-[#071224] xl:text-[2.75rem]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Camps &amp;{" "}
              <span className="bg-gradient-to-r from-[#2a487e] to-[#1e9b8d] bg-clip-text text-transparent">
                Events We Attended
              </span>
            </h2>

            <div className="h-0.5 w-12 rounded-full bg-gradient-to-r from-[#2a487e] to-[#1e9b8d]" />
          </div>

          <a
            href="/updates"
            onClick={() => trackButtonClick("updates_view_all")}
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e9b8d] transition-colors hover:text-[#0f7268]"
          >
            View All Updates
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#1e9b8d]/30 bg-[#1e9b8d]/8">
              <LuArrowRight className="h-3 w-3" />
            </span>
          </a>
        </div>

        {/* ── Filters ── */}
        <div className="reveal mb-8 flex flex-wrap gap-2">
          {(["All", "Camp"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-300 ${
                filter === f
                  ? "bg-[#1e9b8d] text-white shadow-[0_4px_16px_rgba(30,155,141,0.35)]"
                  : "border border-white/80 bg-white/65 text-slate-500 backdrop-blur-sm hover:border-[#1e9b8d]/30 hover:text-[#1e9b8d]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Cards (centered feature cards) ── */}
        <div className="mx-auto max-w-4xl space-y-6">
          {filtered.map((post, i) => {
            const ts = typeStyles[post.type];
            return (
              <article
                key={post.title}
                className="reveal-zoom group flex w-full flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/80 shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-all duration-300 hover:border-[#2a487e]/20 hover:shadow-[0_16px_48px_rgba(42,72,126,0.14)] sm:flex-row"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                {/* Image */}
                <div className="relative h-56 w-full shrink-0 overflow-hidden sm:h-auto sm:min-h-[260px] sm:w-[42%]">
                  <Image
                    src={post.img}
                    alt={post.title}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 400px"
                  />
                  {/* Type badge */}
                  <span
                    className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm ${ts.bg} ${ts.text}`}
                  >
                    {ts.icon}
                    {post.type}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-3 p-6 sm:p-8">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <LuCalendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <LuMapPin className="h-3 w-3" />
                      {post.location}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-lg font-bold leading-snug text-[#071224] transition-colors group-hover:text-[#2a487e] sm:text-xl"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-slate-500">{post.description}</p>

                  {/* Read more */}
                  <button
                    onClick={() => openModal(post)}
                    className="mt-auto inline-flex w-fit items-center gap-1 text-xs font-semibold text-[#1e9b8d] transition-colors hover:text-[#0f7268]"
                  >
                    Read more <LuArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ── Detail modal ── */}
      {selectedPost && (() => {
        const ts = typeStyles[selectedPost.type];
        return (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
            onClick={closeModal}
          >
            {/* Backdrop */}
            <div
              className={`absolute inset-0 bg-[#071224]/75 backdrop-blur-sm transition-opacity duration-300 ${isModalOpen ? "opacity-100" : "opacity-0"}`}
            />

            {/* Panel */}
            <div
              className={`relative flex w-full max-w-lg max-h-[88vh] flex-col overflow-hidden rounded-3xl bg-white
                         shadow-[0_8px_16px_rgba(0,0,0,0.08),_0_32px_80px_rgba(0,0,0,0.25)]
                         transition-all duration-300
                         ${isModalOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-6"}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top gradient bar */}
              <div className="h-1 w-full flex-shrink-0 bg-gradient-to-r from-[#1e9b8d] to-[#2a487e]" />

              {/* Header */}
              <div className="flex items-start gap-4 px-6 pt-5 pb-4 border-b border-slate-100 flex-shrink-0">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${ts.bg} ${ts.text}`}>
                  {ts.icon}{selectedPost.type}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[17px] font-extrabold leading-tight text-[#071224]" style={{ fontFamily: "var(--font-heading)" }}>
                    {selectedPost.title}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><LuCalendar className="h-3 w-3" />{selectedPost.date}</span>
                    <span className="flex items-center gap-1"><LuMapPin className="h-3 w-3" />{selectedPost.location}</span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600"
                >
                  <LuX className="h-4 w-4" />
                </button>
              </div>

              {/* Image */}
              <div className="relative h-48 shrink-0 overflow-hidden sm:h-56">
                <Image
                  src={selectedPost.img}
                  alt={selectedPost.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 512px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071224]/40 to-transparent" />
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mb-4 h-px bg-gradient-to-r from-[#1e9b8d]/30 via-[#1e9b8d]/10 to-transparent" />
                <p className="mb-3 text-sm leading-relaxed text-slate-600">{selectedPost.description}</p>
                {selectedPost.details && (
                  <p className="whitespace-pre-line text-sm leading-relaxed text-slate-500">{selectedPost.details}</p>
                )}
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 border-t border-slate-100 px-6 py-4 bg-slate-50/60">
                <button
                  onClick={closeModal}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] py-3 text-sm font-bold text-white
                             shadow-[0_4px_16px_rgba(30,155,141,0.35)]
                             transition-all duration-300 hover:from-[#25b8a8] hover:to-[#344f8c] hover:shadow-[0_6px_24px_rgba(30,155,141,0.50)]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
