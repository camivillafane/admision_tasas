declare class DetalleLiquidacionDto {
    concepto_id: number;
    cantidad: number;
    monto?: number;
}
export declare class CreateLiquidacionDto {
    contribuyente_id: number;
    tipo_evento: string;
    fecha_evento: string;
    fecha_vencimiento: string;
    detalles: DetalleLiquidacionDto[];
}
export {};
