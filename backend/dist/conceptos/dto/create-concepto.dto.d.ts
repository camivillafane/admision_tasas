export declare class CreateConceptoDto {
    codigo: string;
    descripcion: string;
    tipo: 'tasa' | 'recargo' | 'exencion';
    valor: number;
    activo?: boolean;
}
