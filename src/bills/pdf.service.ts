import { Injectable } from '@nestjs/common';
import { Bill } from './bill.entity';

const PDFDocument = require('pdfkit');

@Injectable()
export class PdfService {
  generateBillPdf(bill: Bill): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // ===== HEADER personalizado por usuario =====
      const businessName = bill.user?.businessName ?? bill.createdBy;
      doc.fontSize(20).text(businessName, { align: 'center' });

      if (bill.user?.businessAddress) {
        doc.fontSize(10).text(bill.user.businessAddress, { align: 'center' });
      }
      if (bill.user?.businessPhone) {
        doc.fontSize(10).text(`Tel: ${bill.user.businessPhone}`, { align: 'center' });
      }
      if (bill.user?.businessEmail) {
        doc.fontSize(10).text(bill.user.businessEmail, { align: 'center' });
      }

      doc.moveDown();
      doc.fontSize(12).text(`Factura #${bill.billNumber}`);
      doc.text(`Fecha: ${new Date(bill.createdAt).toLocaleDateString('es-CR')}`);
      doc.moveDown();

      // ===== CLIENTE =====
      doc.fontSize(14).text('Datos del Cliente', { underline: true });
      doc.fontSize(11).text(`Nombre: ${bill.client.name}`);
      doc.text(`Email: ${bill.client.email ?? '-'}`);
      doc.text(`Teléfono: ${bill.client.phone ?? '-'}`);
      doc.text(`Dirección: ${bill.client.address ?? '-'}`);
      doc.moveDown();

      // ===== DETALLE =====
      doc.fontSize(14).text('Detalle de Productos', { underline: true });
      doc.moveDown();

      bill.details.forEach(detail => {
        doc.fontSize(11).text(`${detail.product.name}`);
        doc.text(
          `Cant: ${detail.quantity} | ₡${Number(detail.unitPrice).toFixed(2)} | Subtotal: ₡${Number(detail.subtotal).toFixed(2)}`
        );
        doc.moveDown(0.5);
      });

      doc.moveDown();
      doc.fontSize(14).text(`TOTAL: ₡${Number(bill.total).toFixed(2)}`, { align: 'right' });
      doc.moveDown();
      doc.fontSize(10).text(`Generado por: ${businessName}`, { align: 'right' });

      doc.end();
    });
  }
}