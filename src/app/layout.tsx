import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";

import { ThemeProvider } from "@/components/ThemeProvider";
import { PageLoader }   from "@/components/PageLoader";
import { StructuredData } from "@/components/StructuredData";
import { GTMPageView } from "@/components/GTMPageView";
import { media } from "@/config/media";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://dentglitz.com";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dentglitz - The Complete Dental Care | Dental Clinic in Porur, Chennai",
    template: "%s | Dentglitz Dental Care",
  },
  description:
    "Dentglitz is a complete dental care clinic in Porur, Chennai offering implants, Invisalign, smile design, teeth whitening and painless treatments. Book your appointment online.",
  keywords: [
    "dental clinic Porur",
    "dentist Chennai",
    "dental implants Chennai",
    "Invisalign Chennai",
    "teeth whitening",
    "smile design",
    "Dentglitz",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Dentglitz — The Complete Dental Care",
    title: "Dentglitz — The Complete Dental Care | Porur, Chennai",
    description:
      "Modern, painless dental care in Porur, Chennai. Implants, Invisalign, smile design and more. Book online today.",
    url: SITE_URL,
    locale: "en_IN",
    images: [{ url: media.glowingTeeth, width: 1200, height: 630, alt: "Dentglitz Dental Care" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dentglitz — The Complete Dental Care",
    description: "Modern, painless dental care in Porur, Chennai. Book online today.",
    images: [media.glowingTeeth],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={inter.variable}>
      <body>
        {GTM_ID && (
          <>
            <GoogleTagManager gtmId={GTM_ID} />
            <Suspense fallback={null}>
              <GTMPageView />
            </Suspense>
          </>
        )}
        <StructuredData />
        <ThemeProvider>
          <PageLoader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
