import { Response } from 'express';
import { LiquidacionesService } from './liquidaciones.service';
import { PdfService } from './pdf.service';
import { CreateLiquidacionDto } from './dto/create-liquidacion.dto';
import { UpdateLiquidacionDto } from './dto/update-liquidacion.dto';
export declare class LiquidacionesController {
    private readonly liquidacionesService;
    private readonly pdfService;
    constructor(liquidacionesService: LiquidacionesService, pdfService: PdfService);
    create(dto: CreateLiquidacionDto): Promise<import("./entities/liquidacion.entity").Liquidacion>;
    findAll(): Promise<import("./entities/liquidacion.entity").Liquidacion[]>;
    findOne(id: string): Promise<import("./entities/liquidacion.entity").Liquidacion>;
    update(id: string, dto: UpdateLiquidacionDto): Promise<import("./entities/liquidacion.entity").Liquidacion>;
    remove(id: string): Promise<import("./entities/liquidacion.entity").Liquidacion>;
    pdf(id: string, res: Response): Promise<void>;
}
