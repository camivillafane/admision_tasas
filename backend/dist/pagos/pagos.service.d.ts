import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { Liquidacion } from '../liquidaciones/entities/liquidacion.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
export declare class PagosService {
    private readonly pagoRepository;
    private readonly liquidacionRepository;
    constructor(pagoRepository: Repository<Pago>, liquidacionRepository: Repository<Liquidacion>);
    create(dto: CreatePagoDto): Promise<Pago>;
    findAll(): Promise<Pago[]>;
    findOne(id: number): Promise<Pago>;
    remove(id: number): Promise<{
        eliminado: boolean;
    }>;
}
