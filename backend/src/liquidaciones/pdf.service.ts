import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Liquidacion } from './entities/liquidacion.entity';

@Injectable()
export class PdfService {
  generar(liquidacion: Liquidacion): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.fontSize(18).text('Liquidación de Tasa Eventual', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12);
      doc.text(`N°: ${liquidacion.id}`);
      doc.text(`Contribuyente: ${liquidacion.contribuyente?.apellido}, ${liquidacion.contribuyente?.nombre}`);
      doc.text(`CUIT: ${liquidacion.contribuyente?.cuit}`);
      doc.text(`Tipo de evento: ${liquidacion.tipo_evento}`);
      doc.text(`Fecha del evento: ${new Date(liquidacion.fecha_evento).toLocaleDateString('es-AR')}`);
      doc.text(`Fecha de emisión: ${new Date(liquidacion.fecha_emision).toLocaleDateString('es-AR')}`);
      doc.text(`Fecha de vencimiento: ${new Date(liquidacion.fecha_vencimiento).toLocaleDateString('es-AR')}`);
      doc.text(`Estado: ${liquidacion.estado.toUpperCase()}`);
      doc.moveDown();

      doc.fontSize(14).text('Detalles');
      doc.moveDown(0.5);

      for (const d of liquidacion.detalles || []) {
        const concepto = d.concepto;
        doc.fontSize(11).text(
          `${concepto?.codigo} - ${concepto?.descripcion} x ${d.cantidad} = $${d.monto.toFixed(2)}`,
        );
      }

      doc.moveDown();
      doc.fontSize(16).text(`TOTAL: $${Number(liquidacion.total).toFixed(2)}`, { align: 'right' });

      doc.end();
    });
  }
}
