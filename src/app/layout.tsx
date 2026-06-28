import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/ThemeProvider";
import { PageLoader }   from "@/components/PageLoader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Astrale Dental — Modern dentistry",
  description:
    "Book your dental appointment online. Modern, gentle and trusted dental care.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ThemeProvider>
          <PageLoader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
