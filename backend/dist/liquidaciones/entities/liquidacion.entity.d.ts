import { Contribuyente } from '../../contribuyentes/entities/contribuyente.entity';
import { LiquidacionDetalle } from './liquidacion-detalle.entity';
import { Pago } from '../../pagos/entities/pago.entity';
export declare class Liquidacion {
    id: number;
    numero: string;
    contribuyente_id: number;
    contribuyente: Contribuyente;
    tipo_evento: string;
    fecha_evento: Date;
    fecha_emision: Date;
    fecha_vencimiento: Date;
    total: number;
    estado: 'pendiente' | 'pagada' | 'vencida' | 'anulada';
    detalles: LiquidacionDetalle[];
    pagos: Pago[];
}
