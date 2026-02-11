
export const CURRENT_YEAR = new Date().getFullYear();

// Branding and Versioning (2026 Adaptation)
export const BRAND_YEAR = 2026;
export const APP_VERSION = "4.1.29"; // Audit Certified + Full Cleanup

export const SITE_URL = "https://saberpro-app.vercel.app";

export const BRAND_NAME = `SaberPro ${BRAND_YEAR}`;
export const BRAND_NAME_SPACED = `Saber Pro ${BRAND_YEAR}`;

export const COPYRIGHT_TEXT = `© ${CURRENT_YEAR} Saber Pro Suite. Todos los derechos reservados.`;
export const DEVELOPER_COPYRIGHT = `© ${CURRENT_YEAR} – Saber Pro Trainer v${APP_VERSION}`;

// Email remains static as it's a specific address
export const AUTHOR_NAME = process.env.NEXT_PUBLIC_AUTHOR_NAME || "SaberPro Team";
export const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || "Saber Pro Suite";
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@saberpro.com";
export const SALES_EMAIL = process.env.NEXT_PUBLIC_SALES_EMAIL || "ventas@saberpro.app";
