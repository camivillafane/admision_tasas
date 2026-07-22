import { Liquidacion } from './liquidacion.entity';
import { Concepto } from '../../conceptos/entities/concepto.entity';
export declare class LiquidacionDetalle {
    id: number;
    liquidacion_id: number;
    liquidacion: Liquidacion;
    concepto_id: number;
    concepto: Concepto;
    cantidad: number;
    monto: number;
}
