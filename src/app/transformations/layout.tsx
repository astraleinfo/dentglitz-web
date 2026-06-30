import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smile Transformations — Before & After, Porur Chennai",
  description:
    "Real before-and-after smile transformations at Dentglitz — implants, veneers, aligners and smile design in Porur, Chennai.",
  alternates: { canonical: "/transformations" },
};

export default function TransformationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
