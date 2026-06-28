import { LuMicroscope, LuUsers, LuShieldCheck, LuCalendarCheck, LuGem, LuHeart } from "react-icons/lu";
import type { IconType } from "react-icons";

type Feature = {
  icon: IconType;
  emoji: string;
  title: string;
  desc: string;
  gradient: string;
  span?: string;
  stat?: string;
};

const features: Feature[] = [
  {
    icon: LuMicroscope,
    emoji: "🦷",
    title: "Advanced Dental Technology",
    desc: "Digital X-rays and modern dental equipment for accurate diagnosis and effective, efficient treatment.",
    gradient: "from-primary via-[#2bb8a8] to-[#4DD4C5]",
    span: "lg:col-span-2",
    stat: "Digital X-rays & Modern Equipment",
  },
  {
    icon: LuUsers,
    emoji: "⭐",
    title: "Friendly & Caring Team",
    desc: "Our experienced dental team is dedicated to making every visit warm, welcoming and stress-free.",
    gradient: "from-secondary to-[#6A8BCB]",
  },
  {
    icon: LuShieldCheck,
    emoji: "🏥",
    title: "Clean & Comfortable Clinic",
    desc: "A clean, hygienic and comfortable clinic environment where your well-being always comes first.",
    gradient: "from-[#4DD4C5] to-primary",
  },
  {
    icon: LuShieldCheck,
    emoji: "🧪",
    title: "Strict Sterilization Protocols",
    desc: "Rigorous sterilization and infection control protocols maintained at every stage of your care.",
    gradient: "from-[#6A8BCB] to-secondary",
  },
  {
    icon: LuHeart,
    emoji: "💙",
    title: "Gentle & Painless Treatment",
    desc: "We prioritize a gentle, painless approach so you feel comfortable and confident throughout your treatment.",
    gradient: "from-primary to-[#4DD4C5]",
  },
  {
    icon: LuGem,
    emoji: "❤️",
    title: "Patient Comfort & Long-Term Health",
    desc: "Focused on your comfort, satisfaction and long-term oral health — from your first visit to your last.",
    gradient: "from-secondary via-[#3a5a9e] to-primary",
    span: "lg:col-span-2",
    stat: "Long-Term Oral Health Focus",
  },
  {
    icon: LuCalendarCheck,
    emoji: "💰",
    title: "Affordable & Transparent Pricing",
    desc: "High-quality dental care at fair, transparent prices — no hidden charges, no surprises, just honest care.",
    gradient: "from-primary to-secondary",
    span: "lg:col-span-4",
    stat: "No Hidden Charges",
  },
];

export function WhyUs() {
  return (
    <section id="why" className="relative py-24 overflow-hidden bg-[#f7fafc]">

      {/* Background blobs */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/5 px-4 py-2 mb-5">
            <LuGem className="text-secondary text-sm" />
            <span className="text-sm font-semibold uppercase tracking-widest text-secondary">Why Dentglitz</span>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl leading-tight">
            Where innovation meets{" "}
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              compassionate care
            </span>
          </h2>
          <p className="mt-5 text-lg text-slate-500">
            Every detail is designed around your comfort, safety, and the best possible outcome.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-fr">
          {features.map(({ emoji, title, desc, gradient, span, stat }) => (
            <div
              key={title}
              className={`group relative overflow-hidden rounded-[32px] p-7 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${span ?? ""} bg-gradient-to-br ${gradient}`}
            >
              {/* Glass shine overlay */}
              <div className="absolute inset-0 rounded-[32px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)" }} />

              {/* Top right decorative circle */}
              <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5" />

              {/* Icon */}
              <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-xl font-bold">
                {emoji}
              </div>

              {/* Text */}
              <h3 className="relative text-xl font-bold text-white mb-2">{title}</h3>
              <p className="relative text-sm leading-relaxed text-white/75">{desc}</p>

              {/* Stat badge */}
              {stat && (
                <div className="relative mt-5 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
                  {stat}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
