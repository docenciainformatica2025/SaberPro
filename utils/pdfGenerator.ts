import jsPDF from "jspdf";

// Brand Metrics
const GOLD = [212, 175, 55];
const INK_BLACK = [20, 20, 20];
const TECH_GRAY = [100, 100, 100];
const LIGHT_BG = [255, 255, 255];
const TEXT_MAIN = [20, 20, 20];
const TEXT_LIGHT = [100, 100, 100];

const LOGO_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gold" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop stop-color="#F4C430"/><stop offset="0.5" stop-color="#D4AF37"/><stop offset="1" stop-color="#8C621D"/></linearGradient></defs><rect width="24" height="24" rx="6" fill="url(#gold)"/><path fill-rule="evenodd" clip-rule="evenodd" d="M6.75 4.5C5.50736 4.5 4.5 5.50736 4.5 6.75V9.75C4.5 10.9926 5.50736 12 6.75 12H13.5C14.3284 12 15 12.6716 15 13.5V15.75C15 16.5784 14.3284 17.25 13.5 17.25H6C5.58579 17.25 5.25 17.5858 5.25 18C5.25 18.4142 5.58579 18.75 6 18.75H13.5C15.1569 18.75 16.5 17.4069 16.5 15.75V13.5C16.5 12.2574 15.4926 11.25 14.25 11.25H7.5C6.67157 11.25 6 10.5784 6 9.75V6.75C6 5.92157 6.67157 5.25 7.5 5.25H18C18.4142 5.25 18.75 4.91421 18.75 4.5C18.75 4.08579 18.4142 3.75 18 3.75H7.5C6.25736 3.75 5.25 4.75736 5.25 6H6.75C6.75 5.17157 7.42157 4.5 8.25 4.5H6.75Z" fill="#0A0C0F"/><path d="M16 4.5L19 7.5" stroke="#0A0C0F" stroke-width="2" stroke-linecap="round" opacity="0.8"/></svg>`;

/**
 * Genera un ID de verificación único y rastreable para el reporte.
 */
const generateVerificationID = (seed: string = "") => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const hash = (seed + timestamp).split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    return `SP-${timestamp}-${random}-${Math.abs(hash).toString(36).toUpperCase()}`.substring(0, 20);
};

export const pdfGenerator = {
    /**
     * Generates a "World-Class" Executive Group Report
     */
    generateClassReport: (classroomName: string, students: any[]) => {
        const doc = new jsPDF({ format: 'letter' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const now = new Date();
        const dateStr = now.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'medium' });
        const verifID = generateVerificationID(classroomName);

        // Helpers
        const drawHeader = () => {
            // --- ZONE A: BRAND (Left) ---
            const margin = 14;
            const ly = 10;

            // Isotype (SVG)
            const logoDataUrl = 'data:image/svg+xml;base64,' + btoa(LOGO_SVG);
            doc.addImage(logoDataUrl, 'SVG', margin, ly, 10, 10);

            // Text "SaberPro"
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
            doc.text("SaberPro", margin + 12, ly + 6);

            // Subtitle
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(TECH_GRAY[0], TECH_GRAY[1], TECH_GRAY[2]);
            doc.text("Training Suite 2025", margin + 12, ly + 11);

            // --- ZONE B: METADATA (Right) ---
            const pageWidth = doc.internal.pageSize.getWidth();
            const rx = pageWidth - margin;

            // Document Title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
            const title = "REPORTE EJECUTIVO DE GRUPO";
            const titleWidth = doc.getTextWidth(title);
            doc.text(title, rx - titleWidth, ly + 6);

            // Metadata
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(TECH_GRAY[0], TECH_GRAY[1], TECH_GRAY[2]);
            const meta = `REF: ${verifID}  |  Fecha: ${dateStr.split(',')[0]}`;
            const metaWidth = doc.getTextWidth(meta);
            doc.text(meta, rx - metaWidth, ly + 11);

            // --- ZONE C: DIVIDER ---
            const divY = 28;
            doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
            doc.setLineWidth(1.5);
            doc.line(margin, divY, pageWidth - margin, divY);

            // Context Info (Right)
            doc.setFontSize(9);
            doc.setTextColor(TECH_GRAY[0], TECH_GRAY[1], TECH_GRAY[2]);
            const ctxInfo = `CLASE: ${classroomName.toUpperCase()}`;
            const ctxWidth = doc.getTextWidth(ctxInfo);
            doc.text(ctxInfo, rx - ctxWidth, divY + 6);

            // Security Disclaimer (Left) - "Recomendación de Seguridad"
            doc.setFontSize(6);
            doc.setTextColor(180, 180, 180); // Light Gray
            doc.text("DOCUMENTO CONFIDENCIAL | GENERADO POR SISTEMA SEGURO", margin, divY + 5);

            return 35;
        };

        const drawFooter = (pageNo: number) => {
            const footerY = pageHeight - 35;

            doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
            doc.rect(0, footerY, pageWidth, 35, 'F');

            doc.setTextColor(TEXT_LIGHT[0], TEXT_LIGHT[1], TEXT_LIGHT[2]);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7);

            // Copyright
            doc.text("© 2025 Saber Pro Suite. Todos los derechos reservados.", pageWidth / 2, footerY + 6, { align: 'center' });
            doc.text("Desarrollado por Ing. Antonio Rodriguez para Docencia Informática.", pageWidth / 2, footerY + 10, { align: 'center' });

            // ID de Verificación
            doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
            doc.text(`ID VERIFICACIÓN: ${verifID}`, pageWidth / 2, footerY + 14, { align: 'center' });

            // Disclaimer
            doc.setTextColor(TEXT_LIGHT[0], TEXT_LIGHT[1], TEXT_LIGHT[2]);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(6);
            const disclaimer = "Este documento es un reporte de simulacro generado exclusivamente con fines académicos y de entrenamiento. No sustituye ni tiene validez oficial ante el Instituto Colombiano para la Evaluación de la Educación (ICFES).";
            const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - 40);
            doc.text(splitDisclaimer, pageWidth / 2, footerY + 20, { align: 'center' });

            // Timestamp & Status
            doc.setFontSize(7);
            doc.text("Documento No Oficial", 20, footerY + 28);
            doc.text(`Generado: ${dateStr}`, pageWidth - 20, footerY + 28, { align: 'right' });
            doc.text(`Pág. ${pageNo}`, pageWidth / 2, footerY + 28, { align: 'center' });
        };

        const drawCard = (x: number, label: string, value: string, sub: string, colorRGB: number[]) => {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(230, 230, 230);
            doc.roundedRect(x, 80, 50, 40, 3, 3, 'FD');
            doc.setFillColor(colorRGB[0], colorRGB[1], colorRGB[2]);
            doc.rect(x, 80, 50, 2, 'F');
            doc.setFontSize(9);
            doc.setTextColor(TEXT_LIGHT[0], TEXT_LIGHT[1], TEXT_LIGHT[2]);
            doc.text(label, x + 5, 90);
            doc.setFontSize(22);
            doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
            doc.setFont("helvetica", "bold");
            doc.text(value, x + 5, 103);
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(colorRGB[0], colorRGB[1], colorRGB[2]);
            doc.text(sub, x + 5, 112);
        };

        // --- PAGE 1 ---
        drawHeader();

        doc.setFontSize(22);
        doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
        doc.text("Resumen Ejecutivo De Grupo", 20, 60);

        // Metrics
        const activeCount = students.filter(s => s.lastScore !== undefined).length;
        const riskCount = students.filter(s => {
            const max = s.lastTotalQuestions || 1;
            return ((s.lastScore || 0) / max) * 100 < 40 && s.lastScore !== undefined;
        }).length;
        let avg = 0;
        if (activeCount > 0) {
            const sum = students.filter(s => s.lastScore !== undefined).reduce((acc, s) => {
                const max = s.lastTotalQuestions || 1;
                return acc + ((s.lastScore || 0) / max) * 100;
            }, 0);
            avg = Math.round(sum / activeCount);
        }

        drawCard(20, "PROMEDIO", `${avg}%`, "Nivel Global", GOLD);
        drawCard(80, "ACTIVOS", `${activeCount}`, `de ${students.length}`, [34, 197, 94]);
        drawCard(140, "EN RIESGO", `${riskCount}`, "Alerta", [239, 68, 68]);

        // Distribution Bar
        doc.setFontSize(14);
        doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
        doc.text("Distribución de Rendimiento", 20, 140);
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(20, 148, 170, 10, 5, 5, 'F');

        const total = activeCount || 1;
        const low = students.filter(s => { const m = s.lastTotalQuestions || 1; return ((s.lastScore || 0) / m) * 100 < 40 && s.lastScore !== undefined }).length;
        const mid = students.filter(s => { const m = s.lastTotalQuestions || 1; const p = ((s.lastScore || 0) / m) * 100; return p >= 40 && p < 80 && s.lastScore !== undefined }).length;
        const high = students.filter(s => { const m = s.lastTotalQuestions || 1; const p = ((s.lastScore || 0) / m) * 100; return p >= 80 && s.lastScore !== undefined }).length;

        let xPos = 20;
        const wLow = (low / total) * 170; const wMid = (mid / total) * 170; const wHigh = (high / total) * 170;

        if (wLow > 0) { doc.setFillColor(239, 68, 68); doc.rect(xPos, 148, wLow, 10, 'F'); xPos += wLow; }
        if (wMid > 0) { doc.setFillColor(234, 179, 8); doc.rect(xPos, 148, wMid, 10, 'F'); xPos += wMid; }
        if (wHigh > 0) { doc.setFillColor(34, 197, 94); doc.rect(xPos, 148, wHigh, 10, 'F'); }

        // Legend
        doc.setFontSize(8); doc.setTextColor(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2]);
        doc.text("• Bajo (<40%)", 20, 165); doc.text("• Medio (40-80%)", 60, 165); doc.text("• Alto (>80%)", 100, 165);

        // List
        let y = 180;
        doc.setFontSize(14); doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
        doc.text("Registro Detallado", 20, y); y += 10;
        doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]); doc.rect(20, y - 5, 170, 10, 'F');
        doc.setFontSize(9); doc.setFont("helvetica", "bold");
        doc.text("ESTUDIANTE", 25, y + 2); doc.text("MÓDULO", 90, y + 2); doc.text("PUNTAJE", 150, y + 2, { align: 'center' }); doc.text("ESTADO", 180, y + 2, { align: 'center' });
        y += 10;
        doc.setFont("helvetica", "normal");

        students.forEach((s, i) => {
            if (y > pageHeight - 40) { // adjusted for larger footer
                drawFooter(doc.internal.pages.length - 1);
                doc.addPage();
                drawHeader();
                y = 60;
                doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.text("CONTINUACIÓN...", 20, y); y += 10;
            }
            if (i % 2 === 1) { doc.setFillColor(252, 252, 252); doc.rect(20, y - 5, 170, 10, 'F'); }

            const max = s.lastTotalQuestions || 1;
            const scoreVal = s.lastScore || 0;
            const percent = Math.round((scoreVal / max) * 100);

            doc.setTextColor(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2]);
            doc.text(s.studentName || "Sin Nombre", 25, y + 2);
            doc.setTextColor(TEXT_LIGHT[0], TEXT_LIGHT[1], TEXT_LIGHT[2]);
            doc.text((s.lastModule ? s.lastModule.replace(/_/g, ' ') : "---").substring(0, 25), 90, y + 2);

            doc.setFont("helvetica", "bold");
            if (s.lastScore === undefined) doc.setTextColor(200, 200, 200);
            else if (percent < 40) doc.setTextColor(239, 68, 68);
            else if (percent < 80) doc.setTextColor(234, 179, 8);
            else doc.setTextColor(34, 197, 94);
            doc.text(s.lastScore !== undefined ? `${percent}%` : "-", 150, y + 2, { align: 'center' });

            doc.setFont("helvetica", "normal"); doc.setTextColor(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2]);
            doc.text(s.lastScore !== undefined ? "OK" : "-", 180, y + 2, { align: 'center' });
            y += 10;
        });

        drawFooter(doc.internal.pages.length);
        doc.save(`Reporte_Curso_SaberPro_${classroomName.replace(/\s+/g, '_')}.pdf`);
    },

    /**
     * Generates a "World-Class" Individual Certificate Report
     */
    generateStudentReport: (studentName: string, classroomName: string, score: number, totalQuestions: number, moduleName?: string) => {
        const doc = new jsPDF({ format: 'letter' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const now = new Date();
        const dateStr = now.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'medium' });

        // --- ZONE A: BRAND (Left) ---
        const margin = 14;
        const ly = 10;

        // Isotype (SVG)
        const logoDataUrl = 'data:image/svg+xml;base64,' + btoa(LOGO_SVG);
        doc.addImage(logoDataUrl, 'SVG', margin, ly, 10, 10);

        // Text "SaberPro"
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
        doc.text("SaberPro", margin + 12, ly + 6);

        // Subtitle
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(TECH_GRAY[0], TECH_GRAY[1], TECH_GRAY[2]);
        doc.text("Training Suite 2025", margin + 12, ly + 11);

        // --- ZONE B: METADATA (Right) ---
        const rx = pageWidth - margin;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
        const title = "REPORTE INDIVIDUAL DETALLADO";
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, rx - titleWidth, ly + 6);

        // Metadata
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(TECH_GRAY[0], TECH_GRAY[1], TECH_GRAY[2]);
        const meta = `REF: ${generateVerificationID(studentName)}  |  Fecha: ${dateStr.split(',')[0]}`;
        const metaWidth = doc.getTextWidth(meta);
        doc.text(meta, rx - metaWidth, ly + 11);

        // --- ZONE C: DIVIDER ---
        const divY = 28;
        doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.setLineWidth(1.5);
        doc.line(margin, divY, pageWidth - margin, divY);

        // 2. Identity
        doc.setFontSize(18);
        doc.setTextColor(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2]);
        doc.text(studentName || "Estudiante", 20, 80);
        doc.setFontSize(12);
        doc.setTextColor(TEXT_LIGHT[0], TEXT_LIGHT[1], TEXT_LIGHT[2]);
        doc.text(classroomName ? `Aula: ${classroomName}` : "Simulacro Individual", 20, 88);
        doc.text(`Fecha: ${dateStr.split(',')[0]}`, 20, 94);

        // 3. Hero Score
        const pct = Math.round((score / totalQuestions) * 100);
        let circleCol = [34, 197, 94];
        if (pct < 40) circleCol = [239, 68, 68];
        else if (pct < 80) circleCol = [234, 179, 8];

        const cx = pageWidth - 60; const cy = 90;
        doc.setDrawColor(circleCol[0], circleCol[1], circleCol[2]);
        doc.setLineWidth(3);
        doc.circle(cx, cy, 25, 'S');

        doc.setFontSize(28);
        doc.setTextColor(circleCol[0], circleCol[1], circleCol[2]);
        doc.setFont("helvetica", "bold");
        doc.text(`${pct}%`, cx, cy + 3, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(TEXT_LIGHT[0], TEXT_LIGHT[1], TEXT_LIGHT[2]);
        doc.text("PUNTAJE GLOBAL", cx, cy + 35, { align: 'center' });

        // 4. Analysis
        doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.5);
        doc.line(20, 130, pageWidth - 20, 130);

        doc.setFontSize(14); doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
        doc.text("Análisis de Competencias", 20, 150);

        const analysisText = pct > 80
            ? "El estudiante demuestra un dominio sólido de los conceptos evaluados. Se sugiere mantener el ritmo y abordar desafíos de mayor complejidad."
            : pct > 40
                ? "El desempeño es satisfactorio pero inconsistente. Se recomienda reforzar los temas del módulo reciente para asegurar las bases."
                : "Se detectan brechas importantes en el aprendizaje. Es crítico iniciar un plan de refuerzo inmediato en los conceptos fundamentales.";

        doc.setFontSize(11);
        doc.setTextColor(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2]);
        doc.splitTextToSize(analysisText, pageWidth - 40).forEach((line: any, i: any) => {
            doc.text(line, 20, 160 + (i * 6));
        });

        // 5. Stats Box
        doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
        doc.roundedRect(20, 190, pageWidth - 40, 40, 3, 3, 'F');
        doc.setFontSize(10); doc.setTextColor(TEXT_LIGHT[0], TEXT_LIGHT[1], TEXT_LIGHT[2]);
        doc.text("Módulo Evaluado:", 30, 205);
        doc.text("Preguntas Correctas:", 30, 215);
        doc.text("Total Preguntas:", 120, 215);

        doc.setFontSize(10); doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]); doc.setFont("helvetica", "bold");
        doc.text(moduleName?.replace(/_/g, " ") || "General", 120, 205);
        doc.text(`${score}`, 80, 215);
        doc.text(`${totalQuestions}`, 160, 215);

        // Footer
        const footerY = pageHeight - 35;
        const verifID = generateVerificationID(studentName);

        doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
        doc.rect(0, footerY, pageWidth, 35, 'F');

        doc.setTextColor(TEXT_LIGHT[0], TEXT_LIGHT[1], TEXT_LIGHT[2]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);

        // Copyright
        doc.text("© 2025 Saber Pro Suite. Todos los derechos reservados.", pageWidth / 2, footerY + 6, { align: 'center' });
        doc.text("Desarrollado por Ing. Antonio Rodriguez para Docencia Informática.", pageWidth / 2, footerY + 10, { align: 'center' });

        // Verificación
        doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.text(`ID VERIFICACIÓN: ${verifID}`, pageWidth / 2, footerY + 14, { align: 'center' });

        // Disclaimer
        doc.setTextColor(TEXT_LIGHT[0], TEXT_LIGHT[1], TEXT_LIGHT[2]);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6);
        const disclaimer = "Este documento es un reporte de simulacro generado exclusivamente con fines académicos y de entrenamiento. No sustituye ni tiene validez oficial ante el Instituto Colombiano para la Evaluación de la Educación (ICFES).";
        const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - 40);
        doc.text(splitDisclaimer, pageWidth / 2, footerY + 20, { align: 'center' });

        // Timestamp & Status
        doc.setFontSize(7);
        doc.text("Documento No Oficial", 20, footerY + 28);
        doc.text(`Generado: ${dateStr}`, pageWidth - 20, footerY + 28, { align: 'right' });

        doc.save(`Reporte_${studentName.replace(/\s+/g, '_')}.pdf`);
    },

    /**
     * Generates a "Legal-Grade" Consent Certificate
     */
    generateConsentCertificate: (user: any) => {
        const doc = new jsPDF({ format: 'letter' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const now = new Date();
        const dateStr = now.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'medium' });

        // --- ZONE A: BRAND (Left) ---
        const margin = 14;
        const ly = 10;

        // Isotype (SVG)
        const logoDataUrl = 'data:image/svg+xml;base64,' + btoa(LOGO_SVG);
        doc.addImage(logoDataUrl, 'SVG', margin, ly, 10, 10);

        // Text "SaberPro"
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
        doc.text("SaberPro", margin + 12, ly + 6);

        // Subtitle
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(TECH_GRAY[0], TECH_GRAY[1], TECH_GRAY[2]);
        doc.text("Training Suite 2025", margin + 12, ly + 11);

        // --- ZONE B: METADATA (Right) ---
        const rx = pageWidth - margin;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
        const title = "CONSENTIMIENTO DIGITAL";
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, rx - titleWidth, ly + 6);

        // Metadata
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(TECH_GRAY[0], TECH_GRAY[1], TECH_GRAY[2]);
        const meta = `REF: ${generateVerificationID(user.email)}  |  Fecha: ${dateStr.split(',')[0]}`;
        const metaWidth = doc.getTextWidth(meta);
        doc.text(meta, rx - metaWidth, ly + 11);

        // --- ZONE C: DIVIDER ---
        const divY = 28;
        doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.setLineWidth(1.5);
        doc.line(margin, divY, pageWidth - margin, divY);

        // 2. Certificate Body
        let y = 60; // Reduced initial Y (was 70)
        doc.setFontSize(16);
        doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
        doc.text("Certificado de Cumplimiento - Habeas Data", pageWidth / 2, y, { align: 'center' });

        y += 12;
        doc.setFontSize(11);
        doc.setTextColor(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2]);
        const intro = `Este documento certifica legalmente que el usuario identificado en la plataforma ha aceptado de manera voluntaria, expresa e inequívoca los Términos y Condiciones y la Política de Tratamiento de Datos Personales.`;
        doc.text(doc.splitTextToSize(intro, 160), pageWidth / 2, y, { align: 'center' });

        y += 15; // Reduced intro gap

        // Data Table
        const drawRow = (label: string, value: string, isLast = false) => {
            doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
            doc.rect(30, y - 6, pageWidth - 60, 9, 'F'); // Reduced row height

            doc.setFont("helvetica", "bold");
            doc.setTextColor(TEXT_LIGHT[0], TEXT_LIGHT[1], TEXT_LIGHT[2]);
            doc.text(label, 35, y); // Adjusted text Y

            doc.setFont("helvetica", "normal");
            doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
            doc.text(value, 90, y);

            y += 10; // Reduced row spacing
        };

        drawRow("Usuario / Email:", user.email || "N/A");
        drawRow("ID de Usuario:", user.id);
        drawRow("Fecha de Aceptación:", new Date(user.consentLog.acceptedAt).toLocaleString("es-CO"));
        drawRow("Versión Política:", user.consentLog.version);
        drawRow("Tipo Consentimiento:", user.consentLog.type);
        drawRow("Hash Digital (IP):", user.consentLog.ipHash);

        y += 8; // Reduced spacing before declaration

        // Legal Declaration
        doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.setLineWidth(0.5);
        doc.line(40, y, pageWidth - 40, y);
        y += 8;

        doc.setFontSize(14);
        doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
        doc.setFont("helvetica", "bold");
        doc.text("Declaración Jurada", 40, y);
        y += 6;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(TEXT_LIGHT[0], TEXT_LIGHT[1], TEXT_LIGHT[2]);
        const legalText = `El usuario ha aceptado voluntariamente el tratamiento de sus datos personales conforme a la Ley Estatutaria 1581 de 2012 (Habeas Data) y el Decreto 1377 de 2013 de la República de Colombia. El registro digital es inmutable, trazable y se almacena en servidores seguros, constituyendo prueba digital válida bajo la Ley 527 de 1999 de Comercio Electrónico.`;
        doc.text(doc.splitTextToSize(legalText, pageWidth - 80), 40, y);

        // Stamp
        y += 25; // Much reduces stamp spacing

        doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.setLineWidth(2);
        doc.rect(pageWidth - 80, y, 50, 20, 'S');
        doc.setFontSize(10);
        doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.setFont("helvetica", "bold");
        doc.text("CONFORMIDAD", pageWidth - 55, y + 13, { align: 'center' });
        doc.setFontSize(7);
        doc.text("DIGITAL", pageWidth - 55, y + 17, { align: 'center' });

        // Footer
        const footerY = pageHeight - 35;
        const verifID = generateVerificationID(user.email);

        doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
        doc.rect(0, footerY, pageWidth, 35, 'F');

        doc.setTextColor(TEXT_LIGHT[0], TEXT_LIGHT[1], TEXT_LIGHT[2]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);

        // Copyright
        doc.text("© 2025 Saber Pro Suite. Todos los derechos reservados.", pageWidth / 2, footerY + 6, { align: 'center' });
        doc.text("Desarrollado por Ing. Antonio Rodriguez para Docencia Informática.", pageWidth / 2, footerY + 10, { align: 'center' });

        // Verificación
        doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.text(`ID VERIFICACIÓN: ${verifID}`, pageWidth / 2, footerY + 14, { align: 'center' });

        // Disclaimer
        doc.setTextColor(TEXT_LIGHT[0], TEXT_LIGHT[1], TEXT_LIGHT[2]);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6);
        const disclaimer = "Este certificado es un documento digital de soporte legal. Su validez puede ser verificada contrastando el ID y SP-Hash con la base de datos de auditoría académica.";
        const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - 40);
        doc.text(splitDisclaimer, pageWidth / 2, footerY + 20, { align: 'center' });

        // Timestamp & Status
        doc.setFontSize(7);
        doc.text("Certificado Oficial", 20, footerY + 28);
        doc.text(`Generado: ${dateStr}`, pageWidth - 20, footerY + 28, { align: 'right' });

        doc.save(`Consentimiento_${user.email}_${dateStr.replace(/[:\/, ]/g, '-')}.pdf`);
    }
};


