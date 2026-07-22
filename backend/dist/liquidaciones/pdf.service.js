"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const PDFDocument = __importStar(require("pdfkit"));
let PdfService = class PdfService {
    generar(liquidacion) {
        return new Promise((resolve) => {
            const doc = new PDFDocument({ margin: 50 });
            const chunks = [];
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
                doc.fontSize(11).text(`${concepto?.codigo} - ${concepto?.descripcion} x ${d.cantidad} = $${d.monto.toFixed(2)}`);
            }
            doc.moveDown();
            doc.fontSize(16).text(`TOTAL: $${Number(liquidacion.total).toFixed(2)}`, { align: 'right' });
            doc.end();
        });
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=pdf.service.js.map