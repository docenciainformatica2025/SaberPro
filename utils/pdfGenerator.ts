import jsPDF from "jspdf";

// Brand Metrics
const GOLD = [212, 175, 55];
const INK_BLACK = [20, 20, 20];
const TECH_GRAY = [100, 100, 100];
const LIGHT_BG = [255, 255, 255];
const TEXT_MAIN = [20, 20, 20];
const TEXT_LIGHT = [100, 100, 100];


/**
 * Genera un ID de verificación único y rastreable para el reporte.
 */
const generateVerificationID = (seed: string = "") => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const hash = (seed + timestamp).split('').reduce((a, b: string) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    return `SP-${timestamp}-${random}-${Math.abs(hash).toString(36).toUpperCase()}`.substring(0, 20);
};

/**
 * Normaliza y limpia strings para nombres de archivo internacionales (Slugs)
 */
const slugify = (text: string) => {
    return text
        .toString()
        .normalize('NFD')                   // Decompose combined characters (accents)
        .replace(/[\u0300-\u036f]/g, '')    // Remove accents
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')               // Replace spaces with -
        .replace(/[^\w-]+/g, '')            // Remove non-word characters
        .replace(/--+/g, '-')               // Replace multiple - with single -
        .toUpperCase();                     // Institutional style
};

/**
 * Genera un nombre de archivo institucional estricto
 */
const generateFileName = (type: string, name: string, verifID: string) => {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
    const slugName = slugify(name);
    return `SABERPRO_${type.toUpperCase()}_${date}_${slugName}_${verifID.split('-').pop()}.pdf`;
};

export interface Student {
    studentName: string;
    lastScore?: number;
    lastTotalQuestions?: number;
    lastModule?: string;
}

export interface UserConsent {
    email: string;
    id: string;
    consentLog: {
        acceptedAt: string | number | Date;
        version: string;
        type: string;
        ipHash: string;
    };
}

export interface PerformanceReportData {
    user: { name: string; email: string };
    kpis: {
        highestScore: number;
        averageScore: number;
        totalSimulations: number;
        questionsAnswered: number;
    };
    trendData: { name: string; value: number }[];
    radarData: { name: string; value: number }[];
}

export const pdfGenerator = {
    /**
     * Generates a "World-Class" Executive Performance Report
     */
    generatePerformanceReport: (data: PerformanceReportData) => {
        const doc = new jsPDF({ format: 'letter' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const now = new Date();
        const dateStr = now.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'medium' });
        const verifID = generateVerificationID(data.user.email);
        const margin = 20;

        // Helpers
        const drawHeader = (title: string) => {
            const ly = 15;
            // Logo Isotype
            doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
            doc.roundedRect(margin, ly, 10, 10, 2, 2, 'F');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text("S", margin + 3.5, ly + 7.5);

            // Brand Text
            doc.setFontSize(16);
            doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
            doc.text("SaberPro", margin + 12, ly + 6);
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(TECH_GRAY[0], TECH_GRAY[1], TECH_GRAY[2]);
            doc.text("Analytics Executive Suite", margin + 12, ly + 11);

            // Title & Meta
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
            const titleWidth = doc.getTextWidth(title);
            doc.text(title, pageWidth - margin - titleWidth, ly + 6);

            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(TECH_GRAY[0], TECH_GRAY[1], TECH_GRAY[2]);
            const meta = `REF: ${verifID}  |  Emisión: ${dateStr.split(',')[0]}`;
            const metaWidth = doc.getTextWidth(meta);
            doc.text(meta, pageWidth - margin - metaWidth, ly + 11);

            // Divider
            doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
            doc.setLineWidth(1);
            doc.line(margin, ly + 18, pageWidth - margin, ly + 18);
        };

        const drawFooter = (pageNo: number) => {
            const fy = pageHeight - 20;
            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(150, 150, 150);
            doc.text("© 2026 Saber Pro Suite - Reporte de Desempeño Académico Certificado (Propulsor IA)", margin, fy);
            doc.text(`Página ${pageNo}`, pageWidth / 2, fy, { align: 'center' });
            doc.text(`Documento verificado: ${verifID}`, pageWidth - margin, fy, { align: 'right' });
        };

        const drawMetricCard = (x: number, y: number, label: string, value: string, sub: string, color: number[]) => {
            const w = (pageWidth - (margin * 2) - 30) / 4;
            const h = 30;
            doc.setFillColor(252, 252, 252);
            doc.setDrawColor(240, 240, 240);
            doc.roundedRect(x, y, w, h, 2, 2, 'FD');

            doc.setFillColor(color[0], color[1], color[2]);
            doc.rect(x, y, 2, h, 'F');

            doc.setFontSize(7);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(120, 120, 120);
            doc.text(label.toUpperCase(), x + 6, y + 8);

            doc.setFontSize(18);
            doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
            doc.text(value, x + 6, y + 19);

            doc.setFontSize(7);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(color[0], color[1], color[2]);
            doc.text(sub, x + 6, y + 26);
        };

        // --- PAGE 1: EXECUTIVE SUMMARY ---
        drawHeader("REPORTE DE ANALÍTICAS");

        // Identity
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
        doc.text(data.user.name, margin, 55);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(TECH_GRAY[0], TECH_GRAY[1], TECH_GRAY[2]);
        doc.text(data.user.email, margin, 62);

        // KPI Section
        const kpiY = 75;
        drawMetricCard(margin, kpiY, "Puntaje Máximo", `${data.kpis.highestScore}%`, "Récord Personal", GOLD);
        drawMetricCard(margin + ((pageWidth - 2 * margin - 30) / 4) + 10, kpiY, "Promedio", `${data.kpis.averageScore}%`, "Eficiencia Media", [59, 130, 246]);
        drawMetricCard(margin + 2 * ((pageWidth - 2 * margin - 30) / 4) + 20, kpiY, "Simulacros", `${data.kpis.totalSimulations}`, "Sesiones Totales", [139, 92, 246]);
        drawMetricCard(margin + 3 * ((pageWidth - 2 * margin - 30) / 4) + 30, kpiY, "Preguntas", `${data.kpis.questionsAnswered}`, "Volumen de Práctica", [236, 72, 153]);

        // Evolution Graph (Vector Simulation)
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
        doc.text("Evolución de Rendimiento", margin, 125);

        const graphW = pageWidth - (margin * 2);
        const graphH = 60;
        const graphY = 135;

        // Grid
        doc.setDrawColor(240, 240, 240);
        doc.setLineWidth(0.5);
        for (let i = 0; i <= 4; i++) {
            const gy = graphY + (graphH * (i / 4));
            doc.line(margin, gy, pageWidth - margin, gy);
            doc.setFontSize(6);
            doc.text(`${100 - (i * 25)}%`, margin - 8, gy + 1);
        }

        // Trend Line
        if (data.trendData.length > 1) {
            doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
            doc.setLineWidth(1.5);
            const step = graphW / (data.trendData.length - 1);

            data.trendData.forEach((point, i) => {
                const px = margin + (i * step);
                const py = graphY + graphH - (point.value / 100 * graphH);

                if (i > 0) {
                    const prevX = margin + ((i - 1) * step);
                    const prevY = graphY + graphH - (data.trendData[i - 1].value / 100 * graphH);
                    doc.line(prevX, prevY, px, py);
                }

                // Point
                doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
                doc.circle(px, py, 1, 'F');

                // Label
                doc.setFontSize(6);
                doc.setTextColor(150, 150, 150);
                doc.text(point.name, px, graphY + graphH + 8, { align: 'center' });
            });
        }

        // Radar / Balance (Manual Layout)
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
        doc.text("Balance de Competencias (Radar)", margin, 220);

        const radarX = pageWidth / 2;
        const radarY = 245;
        const radarRadius = 35;

        // Polygons (3 levels)
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.5);
        [0.33, 0.66, 1].forEach(scale => {
            const r = radarRadius * scale;
            const sides = data.radarData.length || 5;
            for (let i = 0; i < sides; i++) {
                const angle1 = (i * 2 * Math.PI / sides) - Math.PI / 2;
                const angle2 = ((i + 1) * 2 * Math.PI / sides) - Math.PI / 2;
                doc.line(
                    radarX + r * Math.cos(angle1), radarY + r * Math.sin(angle1),
                    radarX + r * Math.cos(angle2), radarY + r * Math.sin(angle2)
                );
            }
        });

        // Values
        if (data.radarData.length > 0) {
            const sides = data.radarData.length;
            doc.setDrawColor(59, 130, 246);
            doc.setFillColor(59, 130, 246);
            doc.setLineWidth(1);

            const points: [number, number][] = data.radarData.map((d, i) => {
                const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
                const r = radarRadius * (d.value / 100);
                return [radarX + r * Math.cos(angle), radarY + r * Math.sin(angle)];
            });

            for (let i = 0; i < points.length; i++) {
                const p1 = points[i];
                const p2 = points[(i + 1) % points.length];
                doc.line(p1[0], p1[1], p2[0], p2[1]);
                doc.circle(p1[0], p1[1], 0.8, 'F');

                // Labels
                const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
                const lx = radarX + (radarRadius + 12) * Math.cos(angle);
                const ly = radarY + (radarRadius + 5) * Math.sin(angle);
                doc.setFontSize(6);
                doc.setTextColor(100, 100, 100);
                doc.text(data.radarData[i].name, lx, ly, { align: 'center' });
            }
        }

        drawFooter(1);

        // --- PAGE 2: DETAILED ANALYSIS & INSIGHTS ---
        doc.addPage();
        drawHeader("ANÁLISIS DE PROYECCIÓN IA");

        const insightY = 50;
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.text("Perspectiva de Inteligencia Artificial", margin, insightY);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);

        const projectionText = `Basado en el análisis de trayectorias de ${data.kpis.totalSimulations} simulacros, tu curva de aprendizaje muestra una tendencia ${data.trendData.length > 1 && data.trendData[data.trendData.length - 1].value > data.trendData[0].value ? "Ascendente" : "Estable"}. Con un puntaje promedio de ${data.kpis.averageScore}%, tu proyección estimada para la prueba real Saber Pro se sitúa en el rango de ${(data.kpis.averageScore * 3)} a ${(data.kpis.averageScore * 3) + 15} puntos.`;

        const splitProjection = doc.splitTextToSize(projectionText, pageWidth - (2 * margin));
        doc.text(splitProjection, margin, insightY + 10);

        // Strategic Recommendations
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Recomendaciones Estratégicas", margin, insightY + 45);

        const recommendations = [
            { title: "Enfoque en Debilidades", desc: "Prioriza los módulos donde el radar muestra menos del 60%. Usa el modo 'Entrenamiento' para ver explicaciones de IA." },
            { title: "Consistencia Post-Simulacro", desc: "La curva de evolución es más estable cuando se realizan al menos 2 simulacros semanales." },
            { title: "Gestión de Tiempo", desc: "Se observa una correlación entre el tiempo por pregunta y la precisión. Intenta balancear velocidad y rigor." },
            { title: "Optimización de Lectura", desc: "Refuerza la lectura crítica, ya que es la competencia transversal que impacta en todos los demás módulos." }
        ];

        let ry = insightY + 58;
        recommendations.forEach(rec => {
            doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
            doc.circle(margin + 2, ry - 1, 1, 'F');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.text(rec.title, margin + 8, ry);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(TECH_GRAY[0], TECH_GRAY[1], TECH_GRAY[2]);
            doc.text(rec.desc, margin + 8, ry + 5);
            ry += 15;
        });

        // Security Stamp
        const stampY = pageHeight - 80;
        doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.setLineWidth(2);
        doc.rect(pageWidth - 70, stampY, 50, 20, 'S');
        doc.setFontSize(10);
        doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.setFont("helvetica", "bold");
        doc.text("REPORTE", pageWidth - 45, stampY + 9, { align: 'center' });
        doc.text("CERTIFICADO", pageWidth - 45, stampY + 15, { align: 'center' });

        drawFooter(2);
        doc.save(generateFileName("REPORT", data.user.name, verifID));
    },

    /**
     * Generates a "World-Class" Executive Group Report
     */
    generateClassReport: (classroomName: string, students: Student[]) => {
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

            // Isotype (Vector Fallback because SVG crashes)
            doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
            doc.roundedRect(margin, ly, 10, 10, 2, 2, 'F');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0); // Black "S"
            doc.text("S", margin + 3.5, ly + 7.5);

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
        doc.save(generateFileName("CLASS", classroomName, verifID));
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

        // Isotype (Vector Fallback)
        doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.roundedRect(margin, ly, 10, 10, 2, 2, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text("S", margin + 3.5, ly + 7.5);

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
        doc.splitTextToSize(analysisText, pageWidth - 40).forEach((line: string, i: number) => {
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

        doc.save(generateFileName("STUDENT", studentName, verifID));
    },

    /**
     * Generates a "Legal-Grade" Consent Certificate
     */
    generateConsentCertificate: (user: UserConsent) => {
        const doc = new jsPDF({ format: 'letter' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const now = new Date();
        const dateStr = now.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'medium' });

        // --- ZONE A: BRAND (Left) ---
        const margin = 14;
        const ly = 10;

        // Isotype (Vector Fallback)
        doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.roundedRect(margin, ly, 10, 10, 2, 2, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text("S", margin + 3.5, ly + 7.5);

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

        doc.save(generateFileName("CONSENT", user.email, verifID));
    }
};


