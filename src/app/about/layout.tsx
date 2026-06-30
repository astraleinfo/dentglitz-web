import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Trusted Dental Clinic in Porur, Chennai",
  description:
    "Meet the team at Dentglitz, a complete dental care clinic in Porur, Chennai. Experienced dentists, advanced technology and gentle, patient-first treatment.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
