import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Updates & Offers — Dentglitz Dental Care, Porur",
  description:
    "Latest news, dental health tips and offers from Dentglitz — The Complete Dental Care in Porur, Chennai.",
  alternates: { canonical: "/updates" },
};

export default function UpdatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
