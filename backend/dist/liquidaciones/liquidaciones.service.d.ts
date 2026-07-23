import { Repository, DataSource } from 'typeorm';
import { Liquidacion } from './entities/liquidacion.entity';
import { LiquidacionDetalle } from './entities/liquidacion-detalle.entity';
import { Concepto } from '../conceptos/entities/concepto.entity';
import { CreateLiquidacionDto } from './dto/create-liquidacion.dto';
import { UpdateLiquidacionDto } from './dto/update-liquidacion.dto';
export declare class LiquidacionesService {
    private readonly liquidacionRepository;
    private readonly detalleRepository;
    private readonly conceptoRepository;
    private readonly dataSource;
    constructor(liquidacionRepository: Repository<Liquidacion>, detalleRepository: Repository<LiquidacionDetalle>, conceptoRepository: Repository<Concepto>, dataSource: DataSource);
    private generarNumero;
    private calcularDetalles;
    create(dto: CreateLiquidacionDto): Promise<Liquidacion>;
    private marcarVencidasAutomatico;
    findAll(): Promise<Liquidacion[]>;
    findOne(id: number): Promise<Liquidacion>;
    update(id: number, dto: UpdateLiquidacionDto): Promise<Liquidacion>;
    remove(id: number): Promise<Liquidacion>;
}
