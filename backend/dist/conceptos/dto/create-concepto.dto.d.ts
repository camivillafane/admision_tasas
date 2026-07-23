export declare class CreateConceptoDto {
    codigo: string;
    descripcion: string;
    tipo: 'tasa' | 'recargo' | 'exencion';
    es_porcentaje?: boolean;
    valor: number;
    activo?: boolean;
}
