import { Liquidacion } from '../../liquidaciones/entities/liquidacion.entity';
export declare class Pago {
    id: number;
    liquidacion_id: number;
    liquidacion: Liquidacion;
    fecha_pago: Date;
    monto: number;
    medio_pago: string;
    observaciones: string;
}
