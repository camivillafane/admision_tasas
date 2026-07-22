"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const pdfkit_1 = __importDefault(require("pdfkit"));
let PdfService = class PdfService {
    generar(liquidacion) {
        return new Promise((resolve) => {
            const doc = new pdfkit_1.default({ margin: 50 });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.fontSize(20).text('MUNICIPALIDAD DE CONCORDIA', { align: 'center' });
            doc.fontSize(14).text('Liquidación de Tasa Eventual', { align: 'center' });
            doc.moveDown();
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown();
            doc.fontSize(12);
            const emision = liquidacion.fecha_emision
                ? new Date(liquidacion.fecha_emision).toLocaleDateString('es-AR')
                : '-';
            const evento = new Date(liquidacion.fecha_evento).toLocaleDateString('es-AR');
            const vencimiento = new Date(liquidacion.fecha_vencimiento).toLocaleDateString('es-AR');
            doc.text(`N° comprobante: ${liquidacion.numero || liquidacion.id}`);
            doc.text(`Contribuyente: ${liquidacion.contribuyente?.apellido}, ${liquidacion.contribuyente?.nombre}`);
            doc.text(`CUIT: ${liquidacion.contribuyente?.cuit || '-'}`);
            doc.text(`Domicilio: ${liquidacion.contribuyente?.domicilio || '-'}`);
            doc.moveDown(0.5);
            doc.text(`Tipo de evento: ${liquidacion.tipo_evento}`);
            doc.text(`Fecha del evento: ${evento}`);
            doc.text(`Fecha de emisión: ${emision}`);
            doc.text(`Fecha de vencimiento: ${vencimiento}`);
            doc.text(`Estado: ${liquidacion.estado.toUpperCase()}`);
            doc.moveDown();
            doc.fontSize(14).text('Detalles', { underline: true });
            doc.moveDown(0.5);
            const startY = doc.y;
            const colCodigo = 50;
            const colDescripcion = 130;
            const colCantidad = 360;
            const colMonto = 470;
            doc.fontSize(10).text('Código', colCodigo, startY, { width: 70, align: 'left' });
            doc.text('Descripción', colDescripcion, startY, { width: 210, align: 'left' });
            doc.text('Cantidad', colCantidad, startY, { width: 70, align: 'right' });
            doc.text('Monto', colMonto, startY, { width: 80, align: 'right' });
            doc.moveDown();
            let y = doc.y;
            for (const d of liquidacion.detalles || []) {
                const concepto = d.concepto;
                const monto = Number(d.monto).toFixed(2);
                doc.text(concepto?.codigo || '-', colCodigo, y, { width: 70, align: 'left' });
                doc.text(concepto?.descripcion || '-', colDescripcion, y, { width: 210, align: 'left' });
                doc.text(Number(d.cantidad).toString(), colCantidad, y, { width: 70, align: 'right' });
                doc.text(`$${monto}`, colMonto, y, { width: 80, align: 'right' });
                y += 20;
            }
            doc.moveDown();
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);
            doc.fontSize(16).text(`TOTAL: $${Number(liquidacion.total).toFixed(2)}`, { align: 'right' });
            doc.moveDown(2);
            doc.fontSize(9).text('Este comprobante es válido sin firma ni sellado por tratarse de una emisión electrónica.', {
                align: 'center',
            });
            doc.end();
        });
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=pdf.service.js.map