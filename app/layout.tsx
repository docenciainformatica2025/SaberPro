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
import { BRAND_NAME_SPACED, APP_VERSION } from "@/lib/config";
import PageTransition from "@/components/layout/PageTransition";
import AdminRoleSwitcher from "@/components/admin/AdminRoleSwitcher";
import MobileTabBar from "@/components/layout/MobileTabBar";
import DarkModeToggle from "@/components/ui/DarkModeToggle";

// Hack to suppress the noisy hydration warning from extensions
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args) => {
    const errorString = args.map(arg => String(arg)).join(" ");
    if (errorString.includes("bis_skin_checked") || errorString.includes("Hydration failed") || errorString.includes("text content does not match")) {
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
  metadataBase: new URL('https://saberpro-2026.vercel.app'),
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

// PREVENT WHITE BARS ON MOBILE BROWSERS (Silicon Valley Standard)
export const viewport = {
  themeColor: "#050505", // Matches bg-metal-dark
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Optional: Prevents zoom if app-like
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning style={{ backgroundColor: '#050505', overscrollBehavior: 'none' }}>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#050505]`}
        style={{ backgroundColor: '#050505', overscrollBehavior: 'none', margin: 0, padding: 0 }}
      >
        <AuthProvider>
          <OnboardingGuard>
            <RoleBasedNavigation />
            <main className="flex-grow flex flex-col pt-20 pb-12 md:pb-32" suppressHydrationWarning>
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <AdminRoleSwitcher />
            <MobileTabBar />
            <DarkModeToggle />
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
              "name": BRAND_NAME_SPACED,
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web",
              "softwareVersion": APP_VERSION,
              "url": "https://saberpro-app.vercel.app",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "COP"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "5200"
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
