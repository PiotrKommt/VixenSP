import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { siteConfig } from "@/lib/site";
import { AuthProviderComponent } from "@/lib/auth";
import { AuthGate } from "@/components/auth/AuthGate";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} · ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "onboarding",
    "user onboarding",
    "SaaS onboarding",
    "product tours",
    "activation",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: `${siteConfig.name} · ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} · ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#070810",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} dark`}>
      <body className="min-h-screen bg-ink-950 font-sans">
        <AuthProviderComponent>
          <AuthGate>{children}</AuthGate>
        </AuthProviderComponent>
      </body>
    </html>
  );
}
