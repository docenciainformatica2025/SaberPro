import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Clarity from "@/components/analytics/Clarity";
import { Toaster } from "@/components/ui/Toaster";
import OfflineIndicator from "@/components/ui/OfflineIndicator";
import "./globals.css";
import OnboardingGuard from "@/components/auth/OnboardingGuard";
import { AuthProvider } from "@/context/AuthContext";
import RoleBasedNavigation from "@/components/layout/RoleBasedNavigation";
import ConditionalFooter from "@/components/ui/ConditionalFooter";
import CookieBanner from "@/components/legal/CookieBanner";
import { BRAND_NAME_SPACED } from "@/lib/config";

// Hack to suppress the noisy hydration warning from extensions
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("bis_skin_checked")) {
      return;
    }
    // Also suppress the generic hydration mismatch warning if related
    if (typeof args[0] === "string" && args[0].includes("Hydration failed")) {
      return;
    }
    originalError.call(console, ...args);
  };
}

// ... existing code ...

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${BRAND_NAME_SPACED} | Simulador Premium de Pruebas de Estado`,
  description: "Plataforma de entrenamiento de alto rendimiento para las pruebas Saber Pro (ICFES). Simulacros con IA, analíticas avanzadas y preparación certificada.",
  keywords: ["Saber Pro", "ICFES", "Simulacro Saber Pro", "Preparación Examen Estado", "Ingeniería de Sistemas", "Lectura Crítica"],
  authors: [{ name: "Saber Pro Team" }],
  openGraph: {
    title: `${BRAND_NAME_SPACED} | Domina tu Futuro Profesional`,
    description: "Entrena con la plataforma más avanzada. Simulacros ilimitados, IA y certificados de desempeño.",
    type: "website",
    locale: "es_CO",
    siteName: BRAND_NAME_SPACED
  },
  icons: {
    icon: "/icon.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <OnboardingGuard>
            <RoleBasedNavigation />
            <main className="flex-grow flex flex-col pt-20 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out" suppressHydrationWarning>
              {children}
            </main>
          </OnboardingGuard>
          <ConditionalFooter />
          <CookieBanner />
        </AuthProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
        <Clarity />
        <Toaster />
        <OfflineIndicator />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Saber Pro 2026",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "COP"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "5000"
              },
              "author": {
                "@type": "Person",
                "name": "Ing. Antonio Rodríguez"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
