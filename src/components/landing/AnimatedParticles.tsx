"use client";

const DRIFTS = [
  "drift-ne", "drift-nw", "drift-se", "drift-sw",
  "drift-n",  "drift-s",  "drift-e",  "drift-w",
];

// Golden-ratio sequences give visually random but evenly distributed positions
const PARTICLES = Array.from({ length: 10 }, (_, i) => {
  const n = i + 1;
  return {
    left:     `${((n * 61.80339887) % 94) + 3}%`,
    top:      `${((n * 38.19660112) % 88) + 6}%`,
    size:     ((n * 11) % 2) + 2,                    // 2–6 px
    anim:     DRIFTS[(n * 3) % 8],
    duration: `${((n * 7) % 5) + 4}s`,               // 4–8 s
    delay:    `-${((n * 13) % 7)}s`,
  };
});

const SECTION_DOTS = [
  { l:"8%",  t:"20%", s:5, a:"drift-ne", d:"5s", dl:"-1s" },
  { l:"18%", t:"70%", s:3, a:"drift-nw", d:"7s", dl:"-3s" },
  { l:"30%", t:"40%", s:4, a:"drift-n",  d:"6s", dl:"-5s" },
  { l:"45%", t:"15%", s:6, a:"drift-e",  d:"8s", dl:"-2s" },
  { l:"55%", t:"80%", s:3, a:"drift-se", d:"5s", dl:"-6s" },
  { l:"65%", t:"30%", s:5, a:"drift-sw", d:"7s", dl:"-4s" },
  { l:"75%", t:"60%", s:4, a:"drift-w",  d:"6s", dl:"-1s" },
  { l:"85%", t:"25%", s:3, a:"drift-ne", d:"8s", dl:"-3s" },
  { l:"92%", t:"55%", s:5, a:"drift-nw", d:"5s", dl:"-5s" },
  { l:"12%", t:"50%", s:3, a:"drift-s",  d:"7s", dl:"-2s" },
  { l:"50%", t:"50%", s:4, a:"drift-e",  d:"6s", dl:"-4s" },
  { l:"38%", t:"85%", s:6, a:"drift-n",  d:"9s", dl:"-6s" },
];

/** Absolute overlay for dark sections — place inside a `relative overflow-hidden` container. */
export function SectionParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[1]">
      {SECTION_DOTS.map(({ l, t, s, a, d, dl }, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: l, top: t, width: s, height: s,
            background: "#4DD4C5",
            boxShadow: "0 0 6px 2px rgba(77,212,197,0.7), 0 0 14px 5px rgba(77,212,197,0.3)",
            animation: `${a} ${d} ease-in-out infinite`,
            animationDelay: dl,
          }}
        />
      ))}
    </div>
  );
}

/** Fixed full-viewport overlay — used once per page at the root. Covers all sections. */
export function AnimatedParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left:     p.left,
            top:      p.top,
            width:    p.size,
            height:   p.size,
            background: "#4DD4C5",
            boxShadow: "0 0 6px 2px rgba(77,212,197,0.7), 0 0 14px 5px rgba(77,212,197,0.3)",
            animation: `${p.anim} ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
