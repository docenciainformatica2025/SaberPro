import jsPDF from "jspdf";

// Brand Metrics (Consistent with pdfGenerator.ts)
const GOLD = [212, 175, 55];
const DARK = [15, 23, 42];
const LIGHT_BG = [248, 250, 252];
const TEXT_MAIN = [51, 65, 85];
const TEXT_LIGHT = [100, 116, 139];

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
            doc.setFillColor(DARK[0], DARK[1], DARK[2]);
            doc.rect(0, 0, pageWidth, 45, 'F');

            // Logo
            doc.setFontSize(26);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255, 255, 255);
            doc.text("SaberPro", 20, 25);
            doc.setFontSize(10);
            doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
            doc.text("DOCUMENTO SOPORTE DE VENTA", 20, 31);

            // Right Info
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.text(`# ${transaction.id || "BORRADOR"}`, pageWidth - 20, 25, { align: 'right' });
            doc.setFontSize(9);
            doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
            doc.text("TRANSACCIÓN DIGITAL", pageWidth - 20, 31, { align: 'right' });
        };

        const drawFooter = () => {
            const footerY = pageHeight - 50;
            doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
            doc.rect(0, footerY, pageWidth, 50, 'F');

            doc.setFontSize(8);
            doc.setTextColor(DARK[0], DARK[1], DARK[2]);
            doc.setFont("helvetica", "bold");
            doc.text("TÉRMINOS Y CONDICIONES", 20, footerY + 12);

            doc.setFont("helvetica", "normal");
            doc.setTextColor(TEXT_LIGHT[0], TEXT_LIGHT[1], TEXT_LIGHT[2]);
            doc.setFontSize(7);
            const legal = "Esta factura electrónica se asimila a una letra de cambio según el Art. 774 del Código de Comercio. Al iniciar el uso del servicio digital, el usuario renuncia al derecho de retracto por tratarse de contenido digital de ejecución inmediata (Ley 1480 de 2011).";
            doc.text(doc.splitTextToSize(legal, pageWidth - 40), 20, footerY + 18);

            // Stamp / Brand info
            doc.setTextColor(DARK[0], DARK[1], DARK[2]);
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
        doc.setTextColor(DARK[0], DARK[1], DARK[2]);
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
        doc.setFillColor(DARK[0], DARK[1], DARK[2]);
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
        doc.setTextColor(DARK[0], DARK[1], DARK[2]);
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
            doc.setTextColor(isTotal ? DARK[0] : TEXT_LIGHT[0], isTotal ? DARK[1] : TEXT_LIGHT[1], isTotal ? DARK[2] : TEXT_LIGHT[2]);
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
