import type { IconType } from "react-icons";
import { FaRegCalendarAlt, FaRegClock, FaTooth, FaRegSmile } from "react-icons/fa";

type Step = { icon: IconType; title: string; desc: string };

const steps: Step[] = [
  { icon: FaRegCalendarAlt, title: "Book online", desc: "Pick a time that suits you in just a few taps." },
  { icon: FaRegClock, title: "Get confirmed", desc: "Instant confirmation by email, SMS & WhatsApp." },
  { icon: FaTooth, title: "Visit us", desc: "Relax with our gentle, expert dental team." },
  { icon: FaRegSmile, title: "Smile brighter", desc: "Walk out happy with a healthier smile." },
];

export function HowItWorks() {
  return (
    <section className="bg-secondary/5 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-semibold uppercase tracking-wide text-primary">How it works</p>
          <h2 className="mt-2 text-3xl font-bold text-secondary sm:text-4xl">
            Your appointment in four easy steps
          </h2>
        </div>
        <div className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="relative text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-3xl text-primary shadow-soft">
                <Icon />
                <span className="absolute -top-2 right-1/2 translate-x-10 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-secondary">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
