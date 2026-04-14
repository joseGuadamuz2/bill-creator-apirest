import { Injectable } from '@nestjs/common';
import { Bill } from './bill.entity';

const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts;

@Injectable()
export class PdfService {

  generateBillPdf(bill: Bill): Promise<Buffer> {
    const docDefinition = {
      content: [
        { text: 'Bill Creator', style: 'header' },
        { text: `Factura #${bill.billNumber}`, style: 'subheader' },
        { text: `Fecha: ${new Date(bill.createdAt).toLocaleDateString('es-CR')}` },
        { text: '\n' },

        { text: 'Datos del Cliente', style: 'sectionTitle' },
        { text: `Nombre: ${bill.client.name}` },
        { text: `Email: ${bill.client.email ?? '-'}` },
        { text: `Telefono: ${bill.client.phone ?? '-'}` },
        { text: `Direccion: ${bill.client.address ?? '-'}` },
        { text: '\n' },

        { text: 'Detalle de Productos', style: 'sectionTitle' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Producto', style: 'tableHeader' },
                { text: 'Cantidad', style: 'tableHeader' },
                { text: 'Precio Unit.', style: 'tableHeader' },
                { text: 'Subtotal', style: 'tableHeader' },
              ],
              ...bill.details.map((detail) => [
                detail.product.name,
                detail.quantity.toString(),
                Number(detail.unitPrice).toFixed(2),
                Number(detail.subtotal).toFixed(2),
              ]),
            ],
          },
        },
        { text: '\n' },

        {
          text: `Total: ${Number(bill.total).toFixed(2)}`,
          style: 'total',
          alignment: 'right',
        },

        { text: '\n\n' },
        {
          text: `Generado por: ${bill.createdBy}`,
          style: 'footer',
          alignment: 'right',
        },
      ],

      styles: {
        header: { fontSize: 22, bold: true, color: '#2c3e50' },
        subheader: { fontSize: 16, bold: true, margin: [0, 4, 0, 4] },
        sectionTitle: { fontSize: 13, bold: true, margin: [0, 8, 0, 4], color: '#2980b9' },
        tableHeader: { bold: true, fillColor: '#2980b9', color: 'white', margin: [4, 4, 4, 4] },
        total: { fontSize: 14, bold: true, margin: [0, 8, 0, 0] },
        footer: { fontSize: 10, color: '#7f8c8d' },
      },

      defaultStyle: { fontSize: 11 },
    };

    return new Promise((resolve, reject) => {
  try {
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.getBuffer((buffer: Buffer) => {
      resolve(buffer);
    }, {
      autoPrint: false
    });
  } catch (error) {
    reject(error);
  }
});
  }
}