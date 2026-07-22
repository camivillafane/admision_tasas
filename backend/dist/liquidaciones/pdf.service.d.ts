import { Liquidacion } from './entities/liquidacion.entity';
export declare class PdfService {
    generar(liquidacion: Liquidacion): Promise<Buffer>;
}
