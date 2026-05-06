import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { AuthSessionProvider } from "@/components/AuthSessionProvider";
import { ToastProvider } from "@/components/ToastProvider";
import { ConsentBanner } from "@/components/ConsentBanner";
import { AnalyticsGate } from "@/components/Analytics/AnalyticsGate";
import { TapDebugger } from "@/components/TapDebugger";
import "./globals.css";
import { Suspense } from "react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Seren — Skin, Understood",
    template: "%s — Seren",
  },
  icons: {
    // Browsers often prioritize `/favicon.ico` and cache it aggressively.
    // We also expose a versioned path at `/brand/*` that is safe to change when we need a cache break.
    icon: [
      { url: "/brand/seren-tab.ico", type: "image/x-icon" },
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/brand/seren-app-icon-240.png", type: "image/png", sizes: "240x240" },
    ],
    shortcut: [
      { url: "/brand/seren-tab.ico", type: "image/x-icon" },
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/brand/seren-app-icon-240.png", type: "image/png", sizes: "240x240" },
    ],
    apple: [
      { url: "/brand/seren-app-icon-240.png", type: "image/png", sizes: "240x240" },
    ],
  },
  description:
    "AI-assisted skin analysis, reviewed by certified dermatologists. Get a clear routine and treatment plan you can follow.",
  openGraph: {
    type: "website",
    siteName: "Seren",
    title: "Seren — Skin, Understood",
    description:
      "AI-assisted skin analysis, reviewed by certified dermatologists. Get a clear routine and treatment plan you can follow.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seren — Skin, Understood",
    description:
      "AI-assisted skin analysis, reviewed by certified dermatologists. Get a clear routine and treatment plan you can follow.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Seren",
    url: siteUrl,
    description:
      "AI-assisted skin analysis, reviewed by certified dermatologists. Get a clear routine and treatment plan you can follow.",
  };

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
        />
        <AuthSessionProvider>
          <ToastProvider>{children}</ToastProvider>
          <ConsentBanner />
          <Suspense fallback={null}>
            <TapDebugger />
          </Suspense>
          <Suspense fallback={null}>
            <AnalyticsGate />
          </Suspense>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
