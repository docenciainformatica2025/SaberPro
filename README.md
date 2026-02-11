# SaberPro Premium 2026 🚀

[![Version](https://img.shields.io/badge/version-2.1.0-gold.svg)](./package.json)
[![License](https://img.shields.io/badge/license-Enterprise-black.svg)](./LICENSE)
[![Standards](https://img.shields.io/badge/compliance-ISO--25010%20%7C%20OWASP-blue.svg)](./SPRINT_TECHNICAL_REPORT.md)

**SaberPro** is a world-class platform designed to calibrate and prepare students for the Colombian State Exam (Saber Pro/TyT) using advanced psychometric principles and a massive, AI-generated, expert-validated question bank.

## 🌟 Premium Features (v2.1.0)

- **Premium Core:** 3,000+ calibrated questions across all modules (Math, English, Reading, Citizenship, Communication).
- **Atomic Engine:** High-performance data seeding with idempotent upsert strategy and non-blocking administrative UI.
- **Brand Excellence:** Dynamic branding system for 2026 compliance and Gold Premium aesthetics.
- **Performance Optimized:** Interaction to Next Paint (INP) < 200ms across all critical paths.

- [Identity Manual](./BRAND_MANUAL.md) - [Design System Standards](./documentation/DESIGN_SYSTEM.md)

## 🛠️ Coding Standards & Best Practices

To maintain code excellence, this project follows these principles:
- **SOLID & DRY:** Prioritize maintainability and reusability over quick hacks.
- **Component Atomicity:** UI must be broken down into atomic, accessible components.
- **Accessibility (A11y):** All interactive elements MUST have `aria-label` or semantic roles.
- **Clean Commits:** Use conventional commits (feat, fix, refactor, docs, chore).
- **TypeScript Strictness:** No `any` types allowed; interface everything.

## 🛠️ Development

### Prerequisites
- Node.js 18+
- Firestore (Firebase Project)

### Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Data Seeding
To populate the database with the Premium Bank:
1. Run generation scripts: `npm run generate-questions` (internal)
2. Go to `/admin/seed` in your local environment.
3. Perform **Atomic Purge** then **Reinject**.

## 🚀 Deployment

The project is configured for automated deployment via Vercel. 
**Note:** Ensure all local question bank changes are pushed to `main` for Vercel to pick up the updated JSON assets.

---
*Desarrollado con estándares de clase mundial para la excelencia académica.*
