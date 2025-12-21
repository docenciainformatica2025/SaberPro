import jsPDF from "jspdf";

// Brand Metrics (Consistent with pdfGenerator.ts)
// Brand Metrics (Light Mode)
const GOLD = [212, 175, 55];
const INK_BLACK = [20, 20, 20];
const TECH_GRAY = [100, 100, 100];
const LIGHT_BG = [255, 255, 255]; // Pure White for Print
const TEXT_MAIN = [20, 20, 20];
const TEXT_LIGHT = [100, 100, 100];

const LOGO_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gold" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop stop-color="#F4C430"/><stop offset="0.5" stop-color="#D4AF37"/><stop offset="1" stop-color="#8C621D"/></linearGradient></defs><rect width="24" height="24" rx="6" fill="url(#gold)"/><path fill-rule="evenodd" clip-rule="evenodd" d="M6.75 4.5C5.50736 4.5 4.5 5.50736 4.5 6.75V9.75C4.5 10.9926 5.50736 12 6.75 12H13.5C14.3284 12 15 12.6716 15 13.5V15.75C15 16.5784 14.3284 17.25 13.5 17.25H6C5.58579 17.25 5.25 17.5858 5.25 18C5.25 18.4142 5.58579 18.75 6 18.75H13.5C15.1569 18.75 16.5 17.4069 16.5 15.75V13.5C16.5 12.2574 15.4926 11.25 14.25 11.25H7.5C6.67157 11.25 6 10.5784 6 9.75V6.75C6 5.92157 6.67157 5.25 7.5 5.25H18C18.4142 5.25 18.75 4.91421 18.75 4.5C18.75 4.08579 18.4142 3.75 18 3.75H7.5C6.25736 3.75 5.25 4.75736 5.25 6H6.75C6.75 5.17157 7.42157 4.5 8.25 4.5H6.75Z" fill="#0A0C0F"/><path d="M16 4.5L19 7.5" stroke="#0A0C0F" stroke-width="2" stroke-linecap="round" opacity="0.8"/></svg>`;

// Interfaces
interface InvoiceTransaction {
    id: string;
    amount: number;
    plan?: string;
    createdAt?: any;
    method?: string | { type: string; provider: string };
}

interface InvoiceUser {
    uid?: string;
    fullName?: string;
    email?: string;
}

export const invoiceGenerator = {
    /**
     * Generates a "World-Class" Purchase Receipt / Invoice
     */
    generateInvoice: (transaction: InvoiceTransaction, user: InvoiceUser) => {
        const doc = new jsPDF({ format: 'letter' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const now = new Date();
        const dateStr = now.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'medium' });

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
            const rx = pageWidth - margin;

            // Document Title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
            const title = "DOCUMENTO SOPORTE DE VENTA";
            const titleWidth = doc.getTextWidth(title);
            doc.text(title, rx - titleWidth, ly + 6);

            // Metadata
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(TECH_GRAY[0], TECH_GRAY[1], TECH_GRAY[2]);
            const meta = `REF: ${transaction.id || "BORRADOR"}  |  Fecha: ${dateStr.split(',')[0]}`;
            const metaWidth = doc.getTextWidth(meta);
            doc.text(meta, rx - metaWidth, ly + 11);

            // --- ZONE C: DIVIDER ---
            const divY = 28;
            doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
            doc.setLineWidth(1.5);
            doc.line(margin, divY, pageWidth - margin, divY);

            return 35;
        };

        const drawFooter = () => {
            const footerY = pageHeight - 50;
            doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
            doc.rect(0, footerY, pageWidth, 50, 'F');

            doc.setFontSize(8);
            doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
            doc.setFont("helvetica", "bold");
            doc.text("TÉRMINOS Y CONDICIONES", 20, footerY + 12);

            doc.setFont("helvetica", "normal");
            doc.setTextColor(TEXT_LIGHT[0], TEXT_LIGHT[1], TEXT_LIGHT[2]);
            doc.setFontSize(7);
            const legal = "Esta factura electrónica se asimila a una letra de cambio según el Art. 774 del Código de Comercio. Al iniciar el uso del servicio digital, el usuario renuncia al derecho de retracto por tratarse de contenido digital de ejecución inmediata (Ley 1480 de 2011).";
            doc.text(doc.splitTextToSize(legal, pageWidth - 40), 20, footerY + 18);

            // Stamp / Brand info
            doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
            doc.setFont("helvetica", "bold");
            doc.text("© 2025 Saber Pro Suite. Todos los derechos reservados.", pageWidth / 2, footerY + 38, { align: 'center' });
            doc.setFont("helvetica", "normal");
            doc.text(`Generado: ${dateStr}`, pageWidth - 20, footerY + 45, { align: 'right' });
        };

        // --- PAGE 1 ---
        drawHeader();

        let y = 65;
        // Seller / Buyer Grid
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
        doc.text("EMISOR", 20, y);
        doc.text("ADQUIRENTE", pageWidth / 2 + 10, y);

        y += 8;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(TEXT_MAIN[0], TEXT_MAIN[1], TEXT_MAIN[2]);

        // Left: Seller
        doc.text("SaberPro Inc.", 20, y);
        doc.text("NIT: 900.888.777-1", 20, y + 6);
        doc.text("facturacion@saberpro.app", 20, y + 12);

        // Right: Buyer
        doc.text(user.fullName || "Usuario SaberPro", pageWidth / 2 + 10, y);
        doc.text(`Email: ${user.email}`, pageWidth / 2 + 10, y + 6);
        let methodCol = typeof transaction.method === 'string' ? transaction.method : (transaction.method?.provider || "Digital");
        doc.text(`Método: ${methodCol}`, pageWidth / 2 + 10, y + 12);

        // Table Header
        y += 35;
        doc.setFillColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
        doc.rect(20, y, pageWidth - 40, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("CONCEPTO", 25, y + 6.5);
        doc.text("UNID.", pageWidth - 100, y + 6.5, { align: 'center' });
        doc.text("PRECIO", pageWidth - 65, y + 6.5, { align: 'right' });
        doc.text("TOTAL", pageWidth - 25, y + 6.5, { align: 'right' });

        // Item Row
        y += 10;
        const amount = transaction.amount || 0;
        const taxRate = 0.19;
        const subtotal = Math.round(amount / (1 + taxRate));
        const tax = amount - subtotal;

        doc.setFillColor(252, 252, 252);
        doc.rect(20, y, pageWidth - 40, 15, 'F');
        doc.setTextColor(INK_BLACK[0], INK_BLACK[1], INK_BLACK[2]);
        doc.setFont("helvetica", "normal");
        doc.text(`Suscripción ${transaction.plan?.toUpperCase() || "PRO"} - Acceso Ilimitado`, 25, y + 9);
        doc.text("1", pageWidth - 100, y + 9, { align: 'center' });
        doc.text(`$${subtotal.toLocaleString('es-CO')}`, pageWidth - 65, y + 9, { align: 'right' });
        doc.text(`$${subtotal.toLocaleString('es-CO')}`, pageWidth - 25, y + 9, { align: 'right' });

        // Calculation Block
        y += 35;
        const drawCalc = (label: string, val: string, isTotal = false) => {
            doc.setFontSize(isTotal ? 14 : 10);
            doc.setFont("helvetica", isTotal ? "bold" : "normal");
            doc.setTextColor(isTotal ? INK_BLACK[0] : TEXT_LIGHT[0], isTotal ? INK_BLACK[1] : TEXT_LIGHT[1], isTotal ? INK_BLACK[2] : TEXT_LIGHT[2]);
            doc.text(label, pageWidth - 80, y);
            doc.text(val, pageWidth - 25, y, { align: 'right' });
            y += isTotal ? 10 : 7;
        };

        drawCalc("Subtotal Gravado:", `$${subtotal.toLocaleString('es-CO')}`);
        drawCalc("IVA (19%):", `$${tax.toLocaleString('es-CO')}`);
        y += 2;
        doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.setLineWidth(0.5);
        doc.line(pageWidth - 80, y - 5, pageWidth - 25, y - 5);
        drawCalc("VALOR TOTAL:", `$${amount.toLocaleString('es-CO')}`, true);

        // Stamp
        doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.setLineWidth(1);
        doc.roundedRect(20, y - 25, 40, 20, 2, 2, 'S');
        doc.setFontSize(8);
        doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.text("PAGO", 40, y - 16, { align: 'center' });
        doc.text("AUTORIZADO", 40, y - 12, { align: 'center' });

        drawFooter();
        doc.save(`Factura_SaberPro_${transaction.id || "Recibo"}.pdf`);
    }
};
