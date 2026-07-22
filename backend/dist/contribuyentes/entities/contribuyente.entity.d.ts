import { Liquidacion } from '../../liquidaciones/entities/liquidacion.entity';
export declare class Contribuyente {
    id: number;
    cuit: string;
    apellido: string;
    nombre: string;
    domicilio: string;
    activo: boolean;
    liquidaciones: Liquidacion[];
}
