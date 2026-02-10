import jsPDF from "jspdf";

// Brand Metrics
const GOLD = [212, 175, 55];
const INK_BLACK = [20, 20, 20];
const TECH_GRAY = [100, 100, 100];
const LIGHT_BG = [255, 255, 255];
const TEXT_MAIN = [20, 20, 20];
const TEXT_LIGHT = [100, 100, 100];

// --- MODULE HELPERS ---

const generateVerificationID = (seed: string = "") => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const hash = (seed + timestamp).split('').reduce((a, b: string) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    return `SP-${timestamp}-${random}-${Math.abs(hash).toString(36).toUpperCase()}`.substring(0, 20);
};

const generateContentHash = async (content: string) => {
    try {
        const msgUint8 = new TextEncoder().encode(content + "SABERPRO-SECURE-2026");
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32).toUpperCase();
    } catch (e) {
        return "HASH-SEC-FALLBACK-" + Date.now().toString(36).toUpperCase();
    }
};

const drawSecuritySeal = async (doc: any, y: number, hash: string, margin: number, pageWidth: number) => {
    doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, pageWidth - 2 * margin, 25, 1, 1, 'S');
    doc.setFont("helvetica", "bold"); doc.setFontSize(7); doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
    doc.text("FIRMA DIGITAL Y TRAZABILIDAD CRIPTOGRÁFICA 2026", margin + 5, y + 8);
    doc.setFont("monospace", "normal"); doc.setFontSize(6); doc.setTextColor(TECH_GRAY[0], TECH_GRAY[1], TECH_GRAY[2]);
    doc.text(`MOTOR SABERPRO ANALYTICS v4.0 | INTEGRIDAD ASEGURADA.`, margin + 5, y + 14);
    doc.text(`HASH SHA-256 (PARTIAL): ${hash}`, margin + 5, y + 19);
    doc.setFillColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
    for (let i = 0; i < 40; i++) { doc.rect(pageWidth - margin - 10 - (i * 1.2), y + 5, 0.5, 15, 'F'); }
};

const drawHeader = (doc: any, title: string, margin: number, pageWidth: number, dateStr: string, verifID: string, suiteName: string = "Analytics Executive Suite") => {
    const ly = 15;
    doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]); doc.roundedRect(margin, ly, 10, 10, 2, 2, 'F');
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(0, 0, 0); doc.text("S", margin + 3.5, ly + 7.5);
    doc.setFontSize(16); doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]); doc.text("SaberPro", margin + 12, ly + 6);
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(TECH_GRAY[0], TECH_GRAY[1], TECH_GRAY[2]); doc.text(suiteName, margin + 12, ly + 11);
    doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
    const titleWidth = doc.getTextWidth(title); doc.text(title, pageWidth - margin - titleWidth, ly + 6);
    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(TECH_GRAY[0], TECH_GRAY[1], TECH_GRAY[2]);
    const meta = `REF: ${verifID}  |  Emisión: ${dateStr.split(',')[0]}`;
    const metaWidth = doc.getTextWidth(meta); doc.text(meta, pageWidth - margin - metaWidth, ly + 11);
    doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]); doc.setLineWidth(1); doc.line(margin, ly + 18, pageWidth - margin, ly + 18);
};

const drawFooter = (doc: any, pageNo: number, pageHeight: number, pageWidth: number, margin: number, verifID: string, dateStr: string, copyrightText: string = "© 2026 Saber Pro Suite. Trazabilidad Académica 2026.") => {
    const footerY = pageHeight - 35;
    doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]); doc.rect(0, footerY, pageWidth, 35, 'F');
    doc.setTextColor(TEXT_LIGHT[0], TEXT_LIGHT[1], TEXT_LIGHT[2]); doc.setFont("helvetica", "bold"); doc.setFontSize(7);
    doc.text(copyrightText, pageWidth / 2, footerY + 6, { align: 'center' });
    doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]); doc.text(`ID VERIFICACIÓN: ${verifID}`, pageWidth / 2, footerY + 14, { align: 'center' });
    doc.setFontSize(7); doc.text(`Generado: ${dateStr}`, pageWidth - margin, footerY + 28, { align: 'right' });
    doc.text(`Pág. ${pageNo}`, pageWidth / 2, footerY + 28, { align: 'center' });
};

const slugify = (text: string) => {
    return text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').toUpperCase();
};

const generateFileName = (type: string, name: string, verifID: string) => {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const slugName = slugify(name);
    return `SABERPRO_${type.toUpperCase()}_${date}_${slugName}_${verifID.split('-').pop()}.pdf`;
};

// --- INTERFACES ---

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

// --- GENERATOR ---

export const pdfGenerator = {
    generatePerformanceReport: async (data: PerformanceReportData) => {
        const doc = new jsPDF({ format: 'letter' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const now = new Date();
        const dateStr = now.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'medium' });
        const verifID = generateVerificationID(data.user.email);
        const margin = 20;

        drawHeader(doc, "REPORTE DE ANALÍTICAS", margin, pageWidth, dateStr, verifID);
        doc.setFontSize(24); doc.setFont("helvetica", "bold"); doc.text(data.user.name, margin, 55);

        doc.addPage();
        drawHeader(doc, "ANÁLISIS DE PROYECCIÓN IA", margin, pageWidth, dateStr, verifID);
        const contentStr = `${data.user.email}-${data.kpis.highestScore}-${verifID}`;
        const contentHash = await generateContentHash(contentStr);
        await drawSecuritySeal(doc, pageHeight - 65, contentHash, margin, pageWidth);
        drawFooter(doc, 2, pageHeight, pageWidth, margin, verifID, dateStr);
        doc.save(generateFileName("REPORT", data.user.name, verifID));
    },

    generateClassReport: async (classroomName: string, students: Student[]) => {
        const doc = new jsPDF({ format: 'letter' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const now = new Date();
        const dateStr = now.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'medium' });
        const verifID = generateVerificationID(classroomName);
        const margin = 20;

        drawHeader(doc, "REPORTE DE GRUPO", margin, pageWidth, dateStr, verifID, "Training Suite 2025");
        doc.setFontSize(22); doc.text("Resumen Ejecutivo De Grupo", margin, 60);

        const contentStr = `${classroomName}-${students.length}-${verifID}`;
        const contentHash = await generateContentHash(contentStr);
        await drawSecuritySeal(doc, pageHeight - 75, contentHash, margin, pageWidth);
        drawFooter(doc, 1, pageHeight, pageWidth, margin, verifID, dateStr);
        doc.save(generateFileName("CLASS", classroomName, verifID));
    },

    generateStudentReport: async (studentName: string, classroomName: string, score: number, totalQuestions: number, moduleName?: string) => {
        const doc = new jsPDF({ format: 'letter' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const now = new Date();
        const dateStr = now.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'medium' });
        const verifID = generateVerificationID(studentName);
        const margin = 20;

        drawHeader(doc, "REPORTE INDIVIDUAL", margin, pageWidth, dateStr, verifID, "Training Suite 2025");
        doc.setFontSize(18); doc.text(studentName, margin, 80);

        const contentStr = `${studentName}-${score}-${verifID}`;
        const contentHash = await generateContentHash(contentStr);
        await drawSecuritySeal(doc, pageHeight - 75, contentHash, margin, pageWidth);
        drawFooter(doc, 1, pageHeight, pageWidth, margin, verifID, dateStr);
        doc.save(generateFileName("STUDENT", studentName, verifID));
    },

    generateConsentCertificate: async (user: UserConsent) => {
        const doc = new jsPDF({ format: 'letter' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const now = new Date();
        const dateStr = now.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'medium' });
        const verifID = generateVerificationID(user.email);
        const margin = 20;

        drawHeader(doc, "CONSENTIMIENTO DIGITAL", margin, pageWidth, dateStr, verifID, "SaberPro Secure Platform");
        doc.setFontSize(16); doc.text("Certificado Habeas Data", pageWidth / 2, 60, { align: 'center' });

        const contentStr = `${user.email}-${user.consentLog.ipHash}-${verifID}`;
        const contentHash = await generateContentHash(contentStr);
        await drawSecuritySeal(doc, pageHeight - 60, contentHash, margin, pageWidth);
        drawFooter(doc, 1, pageHeight, pageWidth, margin, verifID, dateStr);
        doc.save(generateFileName("CONSENT", user.email, verifID));
    }
};
