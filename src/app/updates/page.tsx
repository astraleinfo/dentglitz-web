"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LuCalendar, LuMapPin, LuArrowRight, LuUsers, LuTent, LuSearch, LuX } from "react-icons/lu";
import Image from "next/image";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { BookAppointmentButton } from "@/components/booking/BookAppointmentButton";
import { FaCalendarAlt } from "react-icons/fa";
import { media, type EventType, type UpdatePost } from "@/config/media";

const allUpdates = media.updates;

const typeStyles: Record<EventType, { bg: string; text: string; icon: React.ReactNode }> = {
  Camp:     { bg: "bg-[#1e9b8d]/10 border-[#1e9b8d]/30", text: "text-[#1e9b8d]",  icon: <LuTent  className="h-3 w-3" /> },
  Event:    { bg: "bg-[#2a487e]/10 border-[#2a487e]/30", text: "text-[#2a487e]",  icon: <LuUsers className="h-3 w-3" /> },
  Workshop: { bg: "bg-amber-500/10 border-amber-400/30",  text: "text-amber-600", icon: <LuUsers className="h-3 w-3" /> },
};

export default function UpdatesPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<"All" | EventType>("All");
  const [search, setSearch] = useState("");
  const [selectedPost, setSelectedPost] = useState<UpdatePost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback((post: UpdatePost) => {
    setSelectedPost(post);
    requestAnimationFrame(() => requestAnimationFrame(() => setIsModalOpen(true)));
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPost(null), 300);
  }, []);

  useEffect(() => {
    if (!selectedPost) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedPost, closeModal]);

  const filtered = allUpdates.filter((u) => {
    const matchType = filter === "All" || u.type === filter;
    const matchSearch = search === "" ||
      u.title.toLowerCase().includes(search.toLowerCase()) ||
      u.location.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.06 }
    );
    sectionRef.current?.querySelectorAll(".reveal, .reveal-zoom").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [filter, search]);

  const counts = {
    All:      allUpdates.length,
    Camp:     allUpdates.filter((u) => u.type === "Camp").length,
    Event:    allUpdates.filter((u) => u.type === "Event").length,
    Workshop: allUpdates.filter((u) => u.type === "Workshop").length,
  };

  return (
    <div>
      <Navbar lightText />

      {/* ── Hero banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#071224] via-[#0d1f3c] to-[#0a2420] pt-32 pb-16 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(42,72,126,0.25)_0%,transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_30%,rgba(30,155,141,0.18)_0%,transparent_55%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#4DD4C5]/25 bg-[#4DD4C5]/10 px-4 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#4DD4C5]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#4DD4C5]">Camps &amp; Events</span>
          </div>
          <h1
            className="mb-4 text-4xl font-extrabold leading-[1.1] text-white lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Updates &amp;{" "}
            <span className="bg-gradient-to-r from-[#4DD4C5] to-[#1e9b8d] bg-clip-text text-transparent">
              Community Events
            </span>
          </h1>
          <p className="max-w-xl text-lg text-white/60">
            Dental health camps, conferences, and workshops we attend and organise — because great dental care extends beyond our clinic walls.
          </p>
          <p className="mt-3 text-sm text-white/35">{allUpdates.length} updates — {counts.Camp} camps · {counts.Event} events · {counts.Workshop} workshops</p>
        </div>
      </section>

      {/* ── Updates grid ── */}
      <section
        ref={sectionRef}
        className="bg-parallax relative overflow-hidden py-16 lg:py-20"
        style={{
          backgroundImage: `url(${media.aboutBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/74 backdrop-blur-[2px]" />
        <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#2a487e]/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#4DD4C5]/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

          {/* Filters + Search row */}
          <div className="reveal mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {(["All", "Camp", "Event", "Workshop"] as const).map((f) => (
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
                  <span className="ml-1.5 opacity-60">({counts[f]})</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex items-center">
              <LuSearch className="absolute left-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title or location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-white/80 bg-white/70 py-2 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 backdrop-blur-sm outline-none focus:border-[#2a487e]/40 focus:ring-2 focus:ring-[#2a487e]/10 sm:w-64"
              />
            </div>
          </div>

          {/* Count */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-slate-400">No updates match your filters.</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post, i) => {
                const ts = typeStyles[post.type];
                return (
                  <article
                    key={post.title}
                    className="reveal-zoom group flex flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/82 shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-all duration-300 hover:border-[#2a487e]/20 hover:shadow-[0_12px_40px_rgba(42,72,126,0.12)]"
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    {/* Image */}
                    <div className="relative h-48 shrink-0 overflow-hidden">
                      <Image
                        src={post.img}
                        alt={post.title}
                        fill
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm ${ts.bg} ${ts.text}`}>
                        {ts.icon}
                        {post.type}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1"><LuCalendar className="h-3 w-3" />{post.date}</span>
                        <span className="flex items-center gap-1"><LuMapPin className="h-3 w-3" />{post.location}</span>
                      </div>
                      <h3
                        className="text-base font-bold leading-snug text-[#071224] transition-colors group-hover:text-[#2a487e]"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {post.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-500">{post.description}</p>
                      <button
                        onClick={() => openModal(post)}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#1e9b8d] transition-colors hover:text-[#0f7268]"
                      >
                        Read more <LuArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-parallax relative overflow-hidden py-16" style={{ backgroundImage: `url(${media.aboutBackground})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#071224]/95 to-[#0a2420]/95" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(30,155,141,0.2)_0%,transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2
            className="mb-4 text-3xl font-extrabold text-white lg:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Want Us at Your{" "}
            <span className="bg-gradient-to-r from-[#4DD4C5] to-[#1e9b8d] bg-clip-text text-transparent">
              Next Event?
            </span>
          </h2>
          <p className="mb-8 text-white/60">
            We partner with schools, corporates, and community organisations to run dental health camps and awareness sessions. Get in touch to collaborate.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1e9b8d] to-[#2a487e] px-7 py-3.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(30,155,141,0.4)] transition-all hover:scale-[1.03]"
            >
              Collaborate with Us <LuArrowRight className="h-4 w-4" />
            </a>
            <BookAppointmentButton
              label={
                <span className="flex items-center gap-2">
                  <FaCalendarAlt className="h-4 w-4" />
                  Book a Consultation
                </span>
              }
              className="flex items-center rounded-full border border-white/25 bg-white/8 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/15"
            />
          </div>
        </div>
      </section>

      <div className="bg-parallax" style={{ backgroundImage: `url(${media.aboutBackground})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <Footer />
      </div>

      {/* ── Detail modal ── */}
      {selectedPost && (() => {
        const ts = typeStyles[selectedPost.type];
        return (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
            onClick={closeModal}
          >
            <div
              className={`absolute inset-0 bg-[#071224]/75 backdrop-blur-sm transition-opacity duration-300 ${isModalOpen ? "opacity-100" : "opacity-0"}`}
            />
            <div
              className={`relative flex w-full max-w-lg max-h-[88vh] flex-col overflow-hidden rounded-3xl bg-white
                         shadow-[0_8px_16px_rgba(0,0,0,0.08),_0_32px_80px_rgba(0,0,0,0.25)]
                         transition-all duration-300
                         ${isModalOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-6"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1 w-full flex-shrink-0 bg-gradient-to-r from-[#1e9b8d] to-[#2a487e]" />
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
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mb-4 h-px bg-gradient-to-r from-[#1e9b8d]/30 via-[#1e9b8d]/10 to-transparent" />
                <p className="mb-3 text-sm leading-relaxed text-slate-600">{selectedPost.description}</p>
                {selectedPost.details && (
                  <p className="text-sm leading-relaxed text-slate-500">{selectedPost.details}</p>
                )}
              </div>
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
    </div>
  );
}
