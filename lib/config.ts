
export const CURRENT_YEAR = new Date().getFullYear();

// Logic: Usually exam prep is for the *current* year or *next* year depending on the semester.
// For now, to match "Saber Pro 2026" while we are in 2025, we can use CURRENT_YEAR + 1.
// You can adjust this logic if you want strict year matching.
export const BRAND_YEAR = CURRENT_YEAR + 1;

export const BRAND_NAME = `SaberPro ${BRAND_YEAR}`;
export const BRAND_NAME_SPACED = `Saber Pro ${BRAND_YEAR}`;

export const COPYRIGHT_TEXT = `© ${CURRENT_YEAR} Saber Pro Suite. Todos los derechos reservados.`;
export const DEVELOPER_COPYRIGHT = `© ${CURRENT_YEAR} – Saber Pro Trainer`;

// Email remains static as it's a specific address
export const CONTACT_EMAIL = "docenciainformatica2025@gmail.com";
