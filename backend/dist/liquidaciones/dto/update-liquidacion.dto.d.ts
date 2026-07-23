declare class DetalleLiquidacionDto {
    id?: number;
    concepto_id: number;
    cantidad: number;
    base_imponible?: number;
    monto?: number;
}
export declare class UpdateLiquidacionDto {
    tipo_evento?: string;
    fecha_evento?: string;
    fecha_vencimiento?: string;
    estado?: 'pendiente' | 'pagada' | 'vencida' | 'anulada';
    detalles?: DetalleLiquidacionDto[];
}
export {};
