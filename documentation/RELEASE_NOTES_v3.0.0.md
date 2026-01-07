# Release Notes: v3.0.0 - Saber Pro 2026 Adaptation
**Date**: 2026-01-07
**Status**: GOLD RELEASE

This major release marks the comprehensive adaptation of the platform to the new **ICFES 2026 Standards**, introducing new pedagogical personas, interactive study modes, and a completely revamped question bank.

## 🚀 New Features

### 1. Interactive Study Mode
Standard users and subscribers can now access the simulator in **"Modo de Estudio"**.
- Access via `?mode=study` in any simulation module.
- **Immediate Feedback**: Responses are evaluated instantly.
- **Expert Perspective**: Immediate explanation for every answer.

### 2. "Evaluador Experto" Persona
Implemented a new system-wide persona that provides a strict, professional, and pedagogical tone.
- **Tips Saber Pro 2026**: High-value technical advice provided during the feedback phase to improve test-taking strategies.

### 3. Open-Ended Argument Tasks
Specifically for **Comunicación Escrita**, we've introduced a new question type:
- **Argument Outlining**: Users are prompted to outline 3 solid arguments for current controversial topics (AI regulation, Energy Transition, etc.) in a dedicated text area.

## 📊 Content Revamp (3000+ Items)
The procedural generation engine has been fully aligned with the 2026 difficulty matrix:
- **Lectura Crítica**: Added philosophical discourse analysis and opinion column bias detection.
- **Competencias Ciudadanas**: Scenarios involving constitutional rights conflicts and proportionality tests.
- **Razonamiento Cuantitativo**: Real finance modeling (inflation vs. return) and news data interpretation.
- **Inglés**: Standardized to B1/B2 difficulty with inferential reading focus.

## 🛠 Technical Changes
- **Core Strategy**: Migrated logic from hardcoded diagnostic questions to fully dynamic generation.
- **Versioning**: Implemented centralized version control in `lib/config.ts`.
- **UI Architecture**: Enhanced `QuizEngine` and `QuestionCard` to support dual-run modes (Simulation vs. Study) and dynamic prompt types.

---
**Build ID**: 2026.01.07.PRO
**Developed by**: Ing. Antonio Rodríguez
