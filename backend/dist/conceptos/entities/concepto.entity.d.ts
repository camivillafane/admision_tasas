import { LiquidacionDetalle } from '../../liquidaciones/entities/liquidacion-detalle.entity';
export declare class Concepto {
    id: number;
    codigo: string;
    descripcion: string;
    tipo: 'tasa' | 'recargo' | 'exencion';
    es_porcentaje: boolean;
    valor: number;
    activo: boolean;
    detalles: LiquidacionDetalle[];
}
