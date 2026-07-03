"use client";

import { useEffect, useRef, useState } from "react";
import { LuStar, LuQuote, LuChevronDown } from "react-icons/lu";
import { media } from "@/config/media";

// ── Fallback reviews (shown when Google Places API isn't configured) ──
const fallbackReviews = [
  { name: "Ribha Sharma",  avatar: media.testimonialAvatars[0], rating: 5, text: "Excellent experience at Dentglitz. The doctors are very professional and the clinic is top-notch!",                    relativeTime: "" },
  { name: "Arun Kumar",    avatar: media.testimonialAvatars[1], rating: 5, text: "Painless treatment and amazing results. Highly recommended for everyone looking for quality dental care.",              relativeTime: "" },
  { name: "Meera Abin",    avatar: media.testimonialAvatars[2], rating: 5, text: "Very friendly staff and advanced technology. Best dental clinic I have ever visited.",                                   relativeTime: "" },
  { name: "Vikram Peter",  avatar: media.testimonialAvatars[3], rating: 5, text: "I got my implants done here and I am so happy. My smile has never looked better!",                                       relativeTime: "" },
  { name: "Ananya Singh",  avatar: media.testimonialAvatars[4], rating: 5, text: "The Digital Smile Design was incredible — I saw my new smile before treatment even started!",                           relativeTime: "" },
  { name: "Rahul Menon",   avatar: media.testimonialAvatars[5], rating: 5, text: "Came for a routine cleaning and left with a complete smile plan. Very thorough and transparent.",                       relativeTime: "" },
  { name: "Fatima Al",     avatar: media.testimonialAvatars[6], rating: 5, text: "Invisalign treatment at Dentglitz was seamless. The results are beyond my expectations!",                               relativeTime: "" },
  { name: "Suresh Babu",   avatar: media.testimonialAvatars[7], rating: 5, text: "Emergency appointment given immediately. Very caring staff and the doctor was incredibly skilled.",                     relativeTime: "" },
];

type Review = {
  name: string;
  avatar: string | null;
  rating: number;
  text: string;
  relativeTime: string;
};

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <LuStar key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function ReviewCard({ r, onOpen }: { r: Review; onOpen: (r: Review) => void }) {
  const isLong = r.text.length > 150;
  return (
    <div className="flex h-72 w-72 flex-shrink-0 flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <LuQuote className="mb-3 h-7 w-7 flex-shrink-0 text-primary/20" />
      <StarRow count={r.rating} />
      <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-4" style={{ fontFamily: "var(--font-sans)" }}>
        &ldquo;{r.text}&rdquo;
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => onOpen(r)}
          className="mt-1 self-start text-xs font-semibold text-primary transition hover:underline"
        >
          Read more →
        </button>
      )}
      <div className="mt-auto flex items-center gap-3 border-t border-slate-50 pt-4">
        {r.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={r.avatar}
            alt={r.name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-2 ring-primary/20">
            {r.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-slate-900">{r.name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <svg className="h-3 w-3" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            </svg>
            <span className="text-[10px] text-slate-400">
              {r.relativeTime ? r.relativeTime : "Google Review"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);
  const [overallRating, setOverallRating] = useState<number | null>(4.9);
  const [totalReviews, setTotalReviews] = useState<number | null>(1300);
  const [selected, setSelected] = useState<Review | null>(null);

  useEffect(() => {
    fetch("/api/google-reviews")
      .then((r) => r.json())
      .then((data) => {
        if (data.reviews?.length) {
          // Pad with fallback reviews if Google only returns a few
          const combined = [...data.reviews];
          if (combined.length < 5) {
            combined.push(...fallbackReviews.slice(combined.length));
          }
          setReviews(combined);
        }
        if (data.rating) setOverallRating(data.rating);
        if (data.totalReviews) setTotalReviews(data.totalReviews);
      })
      .catch(() => {
        // silently keep fallback data
      });
  }, []);

  const doubled = [...reviews, ...reviews]; // infinite loop

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    sectionRef.current?.querySelectorAll(".reveal, .reveal-zoom").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* ── Google Reviews Section ── */}
      <section ref={sectionRef} id="reviews" className="relative overflow-hidden scroll-mt-28 py-24">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px]" />
        {/* Blobs */}
        <div className="pointer-events-none absolute -left-40 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

          {/* Header */}
          <div className="reveal mb-12 text-center">
            <div className="section-badge mb-5 inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Google Reviews</span>
            </div>
            <h2 className="section-heading mb-3">
              Trusted by Thousands of{" "}
              <span className="text-brand-gradient">Happy Smiles</span>
            </h2>

            {/* Google rating badge */}
            <div className="mt-6 inline-flex items-center gap-4 rounded-full border border-slate-200 bg-white px-6 py-3 shadow-sm">
              <svg className="h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
                  {overallRating?.toFixed(1) ?? "4.9"}
                </span>
                <div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <LuStar key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    From {totalReviews ? `${totalReviews.toLocaleString()}+` : "1,300+"} Google Reviews
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Infinite auto-scroll carousel */}
          <div className="relative reveal overflow-hidden">
            {/* Left fade */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 sm:w-24 bg-gradient-to-r from-[#F5F7FA] to-transparent" />
            {/* Right fade */}
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 sm:w-24 bg-gradient-to-l from-[#F5F7FA] to-transparent" />

            <div className="flex gap-5 animate-scroll-x marquee-track w-max">
              {doubled.map((r, i) => (
                <ReviewCard key={`${r.name}-${i}`} r={r} onOpen={setSelected} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Full-review modal ── */}
      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            >
              ✕
            </button>
            <LuQuote className="mb-3 h-8 w-8 text-primary/20" />
            <StarRow count={selected.rating} />
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600" style={{ fontFamily: "var(--font-sans)" }}>
              &ldquo;{selected.text}&rdquo;
            </p>
            <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
              {selected.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selected.avatar}
                  alt={selected.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-2 ring-primary/20">
                  {selected.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-slate-900">{selected.name}</p>
                {selected.relativeTime && (
                  <p className="text-[10px] text-slate-400">{selected.relativeTime}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
