import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery — Clinic & Smile Makeovers in Porur, Chennai",
  description:
    "See our Porur dental clinic, advanced equipment and real patient smile makeovers at Dentglitz — The Complete Dental Care.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
