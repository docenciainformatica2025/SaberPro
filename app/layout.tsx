import type { Metadata } from "next";
import { Inter, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Clarity from "@/components/analytics/Clarity";
import { Toaster } from "@/components/ui/Toaster";
import OfflineIndicator from "@/components/ui/OfflineIndicator";
import "./saberpro-core.css";
import RouteGuard from "@/components/auth/RouteGuard";
import { AuthProvider } from "@/context/AuthContext";
import RoleBasedNavigation from "@/components/layout/RoleBasedNavigation";
import ConditionalFooter from "@/components/ui/ConditionalFooter";
import CookieBanner from "@/components/legal/CookieBanner";
import { BRAND_NAME_SPACED, APP_VERSION } from "@/lib/config";
import PageTransition from "@/components/layout/PageTransition";
import AdminRoleSwitcher from "@/components/admin/AdminRoleSwitcher";
import MobileTabBar from "@/components/layout/MobileTabBar";
import DarkModeToggle from "@/components/ui/DarkModeToggle";
import VersionUpdateGuard from "@/components/ui/VersionUpdateGuard";
import SessionWatcher from "@/components/auth/SessionWatcher";

// --- HYDRATION & EXTENSION CLEANUP (MAESTRO 2026) ---
if (typeof window !== "undefined") {
    // 1. Silent Hydration: Suppress specific annoying errors from extensions
    const originalError = console.error;
    console.error = (...args) => {
        const msg = String(args[0]);
        if (msg.includes("bis_skin_checked") || msg.includes("Hydration") || msg.includes("extra attributes")) return;
        originalError.apply(console, args);
    };

    // 2. Early DOM Sanitization
    const cleanNodes = (root: ParentNode) => {
        root.querySelectorAll('[bis_skin_checked]').forEach(el => el.removeAttribute('bis_skin_checked'));
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => cleanNodes(document));
    } else {
        cleanNodes(document);
    }

    // 3. Persistent Cleanup (Mutation Observer)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
            if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked') {
                (m.target as HTMLElement).removeAttribute('bis_skin_checked');
            } else if (m.type === 'childList') {
                m.addedNodes.forEach(node => {
                    if (node instanceof Element) {
                        if (node.hasAttribute('bis_skin_checked')) node.removeAttribute('bis_skin_checked');
                        cleanNodes(node);
                    }
                });
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true, subtree: true, childList: true });
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  variable: "--font-academic",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
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
  },
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0C0F" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="bg-[var(--theme-bg-base)]">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${geistMono.variable} ${cormorant.variable} antialiased min-h-screen flex flex-col bg-[var(--theme-bg-base)] transition-colors duration-500`}
      >
        <div className="fog-bg" suppressHydrationWarning />
        <AuthProvider>
          <SessionWatcher />
          <VersionUpdateGuard>
            <RouteGuard>
              <RoleBasedNavigation />
              <main className="relative z-10 flex-grow flex flex-col pt-[var(--header-safe-zone)] pb-8 md:pb-12" suppressHydrationWarning={true}>
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
              <AdminRoleSwitcher />
              <MobileTabBar />
              <DarkModeToggle />
            </RouteGuard>
            <ConditionalFooter />
            <CookieBanner />
          </VersionUpdateGuard>
        </AuthProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
        <Clarity />
        <Toaster />
        <OfflineIndicator />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    // SW Registered
                  }).catch(function(err) {
                    // SW Registration failed
                  });
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
