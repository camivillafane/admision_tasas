import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Liquidacion } from './entities/liquidacion.entity';

@Injectable()
export class PdfService {
  generar(liquidacion: Liquidacion): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      const green = '#5ba817';
      const emision = liquidacion.fecha_emision
        ? new Date(liquidacion.fecha_emision).toLocaleDateString('es-AR')
        : '-';
      const evento = new Date(liquidacion.fecha_evento).toLocaleDateString('es-AR');
      const vencimiento = new Date(liquidacion.fecha_vencimiento).toLocaleDateString('es-AR');

      // Header
      doc.rect(50, 50, 495, 60).fill(green);
      doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold')
        .text('MUNICIPALIDAD DE CONCORDIA', 60, 60, { width: 350 });
      doc.fontSize(10).font('Helvetica')
        .text('Direccion de Rentas - Tasas Eventuales', 60, 82, { width: 350 });

      const num = `N ${liquidacion.numero || liquidacion.id}`;
      doc.fontSize(13).font('Helvetica-Bold')
        .text(num, 60, 63, { width: 475, align: 'right' });

      // Estado
      const estadoLabel = liquidacion.estado.toUpperCase();
      doc.fontSize(10).text(`Estado: ${estadoLabel}`, 60, 83, { width: 475, align: 'right' });

      let y = 130;

      // Datos contribuyente
      doc.fillColor(green).fontSize(9).font('Helvetica-Bold').text('CONTRIBUYENTE', 50, y);
      y += 14;
      doc.fillColor('#1D1D1B').fontSize(10).font('Helvetica');
      const nombre = `${liquidacion.contribuyente?.apellido || ''}, ${liquidacion.contribuyente?.nombre || ''}`;
      doc.text(`Nombre: ${nombre}`, 50, y, { width: 495 });
      y += 14;
      doc.text(`CUIT: ${liquidacion.contribuyente?.cuit || '-'}`, 50, y, { width: 495 });
      y += 14;
      doc.text(`Domicilio: ${liquidacion.contribuyente?.domicilio || '-'}`, 50, y, { width: 495 });

      y += 24;

      // Datos comprobante
      doc.fillColor(green).fontSize(9).font('Helvetica-Bold').text('COMPROBANTE', 50, y);
      y += 14;
      doc.fillColor('#1D1D1B').fontSize(10).font('Helvetica');
      doc.text(`Fecha de emision: ${emision}`, 50, y, { width: 240 });
      doc.text(`Fecha del evento: ${evento}`, 300, y, { width: 245 });
      y += 14;
      doc.text(`Fecha de vencimiento: ${vencimiento}`, 50, y, { width: 240 });
      doc.text(`Tipo de evento: ${liquidacion.tipo_evento}`, 300, y, { width: 245 });

      y += 30;

      // Linea separadora
      doc.moveTo(50, y).lineTo(545, y).stroke(green);
      y += 15;

      // Tabla - header
      doc.rect(50, y, 495, 20).fill(green);
      doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold');
      doc.text('Codigo', 55, y + 5, { width: 60 });
      doc.text('Descripcion', 120, y + 5, { width: 200 });
      doc.text('Cant.', 325, y + 5, { width: 45, align: 'right' });
      doc.text('Base', 375, y + 5, { width: 75, align: 'right' });
      doc.text('Monto', 455, y + 5, { width: 85, align: 'right' });
      y += 20;

      // Tabla - filas
      let idx = 0;
      for (const d of liquidacion.detalles || []) {
        const concepto = d.concepto;
        const monto = Number(d.monto).toFixed(2);
        const base = d.base_imponible ? `$${Number(d.base_imponible).toFixed(2)}` : '-';

        if (idx % 2 === 0) {
          doc.rect(50, y, 495, 18).fill('#f5f5f5');
        }

        doc.fillColor('#1D1D1B').fontSize(9).font('Helvetica');
        doc.text(concepto?.codigo || '-', 55, y + 4, { width: 60 });
        doc.text(concepto?.descripcion || '-', 120, y + 4, { width: 200 });
        doc.text(Number(d.cantidad).toString(), 325, y + 4, { width: 45, align: 'right' });
        doc.text(base, 375, y + 4, { width: 75, align: 'right' });
        doc.text(`$${monto}`, 455, y + 4, { width: 85, align: 'right' });

        y += 18;
        idx++;
      }

      // Linea fin tabla
      doc.moveTo(50, y).lineTo(545, y).stroke('#cccccc');
      y += 20;

      // Total
      doc.fillColor(green).fontSize(14).font('Helvetica-Bold')
        .text(`TOTAL: $${Number(liquidacion.total).toFixed(2)}`, 50, y, { width: 495, align: 'right' });

      y += 50;

      // Footer
      doc.moveTo(50, y).lineTo(545, y).stroke('#cccccc');
      y += 10;
      doc.fillColor('#888888').fontSize(8).font('Helvetica')
        .text('Este comprobante es valido sin firma ni sellado por tratarse de una emision electronica.', 50, y, { width: 495, align: 'center' });
      y += 12;
      doc.text('Municipalidad de Concordia - Entre Rios - Argentina', 50, y, { width: 495, align: 'center' });

      doc.end();
    });
  }
}
